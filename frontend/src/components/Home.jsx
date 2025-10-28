import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import UpcomingEvents from "./UpcomingEvents"; //attendee
import NewlyAdded from "./NewlyAdded"; //attendee
import UpdatesRequired from "../components/UpdatesRequired"; //organiser - events to be amended for admin approval
import MyEventsStats from "./MyEventsStats";
import PendingEvents from "../components/PendingEvents"; //admin - new events
import AdminPendingActions from "../components/AdminPendingActions"; //admin - updated events
import PendingAccounts from "../components/PendingAccounts"; //admin - requests for organiser role

export default function Home() {
    const [user, setUser] = useState(null);
    // const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();
    const { selectedCategory } = useOutletContext() || {};
  
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        // navigate("/login");
        navigate("/");
        return;
        }

        try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ name: payload.name, role: payload.role });
        } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        navigate("/");
        }
    }, [navigate]);

    if (!user) return <p>Loading...</p>;

return (
    <div className="home-page">
        {user.role === "attendee" && (
            <>
            <UpcomingEvents />
            <NewlyAdded />
            </>
        )}

        {user.role === "organiser" && (
            <>
            <UpdatesRequired />
            <MyEventsStats />
            </>
        )}

        {user.role === "admin" && (
            <>
            <PendingEvents />
            <AdminPendingActions />
            <PendingAccounts />
            <MyEventsStats />
            </>
        )}
        {/* {user.role === "attendee" && <UpcomingEvents />}
        {user.role === "attendee" && <NewlyAdded />}

        {user.role === "organiser" && <UpdatesRequired />}
        {user.role === "organiser" && <MyEventsStats />}

        {user.role === "admin" && <PendingEvents />}
        {user.role === "admin" && <AdminPendingActions />}
        {user.role === "admin" && <PendingAccounts />}
        {user.role === "admin" && <MyEventsStats />} */}

    </div>
    );
}