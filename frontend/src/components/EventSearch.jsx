import { useEffect, useState } from "react";
import { motion , AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import EventCard from "./EventCard";
import "../styles/eventsearch.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function EventSearch({ category: selectedCategory }) {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [viewMode, setViewMode] = useState("carousel"); // carousel view by default

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/event?status=approved`);
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
      setSearchTerm("");
      setDate("");
    }
  }, [selectedCategory])

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = events.filter((event) => {
      const titleMatch = event.title.toLowerCase().includes(term);
      const locationMatch = event.location.toLowerCase().includes(term);
      const categoryMatch = event.category.toLowerCase().includes(term);
      const dateMatch = new Date(event.date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(term);
      const categoryFilter = category 
        ? event.category.toLowerCase() === category.toLowerCase()
        : true;
      const dateFilter = date
        ? (() => {
          const eventDate = new Date(event.date);
          const day = String(eventDate.getDate()).padStart(2, "0");
          const month = String(eventDate.getMonth() + 1).padStart(2, "0");
          const year = eventDate.getFullYear();
          return `${day}-${month}-${year}` === date.split("-").reverse().join("-");
        })()
        // ? new Date(event.date).toISOString().split("T")[0] === date
        : true;

      return (
        (titleMatch || locationMatch || categoryMatch || dateMatch) &&
        categoryFilter &&
        dateFilter
      );
    });

    setFilteredEvents(filtered);
  }, [searchTerm, category, date, events]);

  useEffect(() => {
    const clearHandler = () => {
      setSearchTerm("");
      setCategory("");
      setDate("");
    };
    window.addEventListener("clearFilters", clearHandler);
    return () => window.removeEventListener("clearFilters", clearHandler);
  })

  const categories = [...new Set(events.map((event) => event.category))];

  // new carousel and grid view - toogle
  return (
    <motion.div
      className="event-search"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ padding: "2rem" }}
    >
      <h2 className="title">Search Events</h2>
      <div className="search-bar-container">
        <motion.input
          type="text"
          placeholder="Search by title, location, category, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          whileFocus={{ scale: 1.03, boxShadow: "0 0 8px rgba(0,0,0,0.1)" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="search-input"
        />

        <div className="filters">
          <motion.select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            whileHover={{ scale: 1.05 }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </motion.select>

          <motion.input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            whileHover={{ scale: 1.05 }}
            className="filter-date"
          />

          {/* View mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === "grid" ? "carousel" : "grid")}
            className="view-toggle-btn"
          >
            {viewMode === "grid" ? "🌀 Carousel View" : "🔳 Grid View"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredEvents.length === 0 ? (
          <motion.p
            key="no-events"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No events found
          </motion.p>
        ) : viewMode === "grid" ? (
          <motion.div
            key="event-grid"
            layout
            className="grid"
            transition={{ layout: { duration: 0.5 } }}
          >
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="event-carousel"
            className="event-carousel-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={30}
              slidesPerView={1}
              centeredSlides
              navigation
              pagination={{ clickable: true }}
              autoplay={{ 
                delay: 3500, 
                disableOnInteraction: false, 
              }}
              speed={900}
              loop
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 1.2,
                slideShadows: false,
              }}
              breakpoints={{
                480: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 1.2, spaceBetween: 25 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
                1440: { slidesPerView: 4, spaceBetween: 50},
              }}
              className="event-carousel"
              onSwiper={(swiper) => {
                const container = swiper.el;
                const handleMouseEnter = () => swiper.autoplay?.stop();
                const handleMouseLeave = () => swiper.autoplay?.start();
                container.addEventListener("mouseenter", handleMouseEnter);
                container.addEventListener("mouseleave", handleMouseLeave);
                swiper.on("destroy", () => {
                  container.removeEventListener("mouseenter", handleMouseEnter);
                  container.removeEventListener("mouseleave", handleMouseLeave);
                });
              }}
              // onSwiper={(swiper) => {
              //   const container = swiper.el;

              //   // Safe hover pause handling
              //   const handleMouseEnter = () => {
              //     if (swiper.autoplay && swiper.autoplay.running) {
              //       swiper.autoplay.stop();
              //     }
              //   };

              //   const handleMouseLeave = () => {
              //     if (swiper.autoplay && !swiper.autoplay.running) {
              //       swiper.autoplay.start();
              //     }
              //   };

              //   container.addEventListener("mouseenter", handleMouseEnter);
              //   container.addEventListener("mouseleave", handleMouseLeave);

              //   // Clean up listeners when Swiper is destroyed
              //   swiper.on("destroy", () => {
              //     container.removeEventListener("mouseenter", handleMouseEnter);
              //     container.removeEventListener("mouseleave", handleMouseLeave);
              //   });
              // }}
            >
              {filteredEvents.map((event) => (
                <SwiperSlide key={event._id}>
                  <EventCard event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}