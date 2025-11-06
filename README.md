# Event Booker

## Hi! This is my exam project for Advanced JavaScript.

I’m building an event booking application from scratch that will cover:

- UX research & design – planning user flows and wireframes before development.

- Full backend functionality – built with Node.js, Express, and MongoDB, including authentication, data models, and a REST API.

- Frontend – built with React, connected to the backend for browsing, booking, and managing events.

- Admin features – approve/reject events, manage users, and view event statistics.

- Organiser workflow – create and edit events, including handling admin feedback (“needs update”) before events are approved.

🚀 Check out the deployed version here: [Eventure Live](https://eventure-events.netlify.app/)

Thanks for dropping by! 🙌

## Endpoints  

<a href="./assets/Endpoints.png" target="_blank">View Endpoints</a>

|                                 |        |                                                  |       |
|---------------------------------|--------|--------------------------------------------------|-------|
| Action                          | Method | URL                                              | Notes                |
| AUTH                            |        |                                                  |                           |
| Register	                      | POST   | http://localhost:5050/auth/register              | Creates a user. Organiser registrations become “pending” until admin approval. |
| Login	                          | POST   | http://localhost:5050/auth/login                 | Returns JWT token and user info. Pending organisers log in as attendee until approved.|
| Logout                          | POST   | http://localhost:5050/auth/logout                | Clears authentication token.|
| EVENTS (public)                 |        |                                                  |               |
| List all events                 | GET	   | http://localhost:5050/event                      | Supports ?status and ?category query filters |
| Single event                    | GET    | http://localhost:5050/event/:eventId             | Get one by ID |
| List categories                 | GET    | http://localhost:5050/event/categories           | Returns distinct event catergories |
| USER / ATTENDEE (protected)     |        |                                                  |               |
| Get current user profile        | GET	   | http://localhost:5050/users/me                   | Returns user info with favourites and booked events |
| Save event to favourites        | POST   | http://localhost:5050/users/favorites/:id        | Adds an events to favourites |
| Remove event to favourites      | DELETE | http://localhost:5050/users/favorites/:eventId   | Removes an events from favourites |
| Book an event                   | POST   | http://localhost:5050/users/bookings/:eventId    | Books an event (adds to user.bookedEvents & send conf email) |
| Cancel an event                 | DELETE | http://localhost:5050/users/bookings/:bookingId  | Cancels an exisitng booking |
| ORGANISER AND ADMIN (protected)      |        |                                                  |               |
| Create new event          	  | POST   | http://localhost:5050/organiser/events           | Organiser (or admin) creates new event. Auto pending status until approved |
| List organiser's events         |	GET    | http://localhost:5050/organiser/events           | Returns organiser’s own events (filter by ?status= optional). |
| Edit existing event             |	PUT    | http://localhost:5050/organiser/events/:id       | Updates an event and sets status to “pending” for re-approval. |
| Cancel event           	         | DELETE | http://localhost:5050/organiser/events/:id       | Soft delete: sets status “cancelled”, notifies attendees and admins. |
| Fetch events with updates required   |  GET    | http://localhost:5050/organiser/events?status=needs-update | Gets events with admin comments for any updates needed before approval        |
| ADMIN ONLY (protected)          |        |                                                  |               |
| Get all users    	              | GET	   | http://localhost:5050/admin/users                | Lists all users (excludes passwords). |
| Create admin user	              | POST   | http://localhost:5050/admin/users                | Admin creates a new user (any role). |
| Update user info	              | PUT    | http://localhost:5050/admin/users/:id            | Admin can update user's details |
| Delete user                     |	DELETE | http://localhost:5050/admin/users/:id            | Admin deletes user |
| Approve organiser request       |	PATCH  | http://localhost:5050/admin/approve-organiser/:id       | Approves pending organiser and updates role to “organiser”. |
| Reject organiser request        |	PATCH  | http://localhost:5050/admin/reject-organiser/:id       | Rejects pending organiser and updates role to “organiser”. |
| Get all events / stats          | GET    | http://localhost:5050/admin/events               | Returns event list + analytics (approved, pending, cancelled, etc.).    |
| Approve / reject event (admin)  |	POST   | http://localhost:5050/admin/events/:id/approve   | Action in body: "approve", "needs-update", "reject" (optionally add comment). |


# Flow Chart

See here for my <a href="./assets/Event-Booker.png" target=" blank">Flow Chart</a> with details of full functions and system flow.

# Persona and UX Research

I spend some time conducting user research and planing my site map and lofi designs in Figma. See here for my work.

<a href="./assets/Personas.png" target="_blank">View Personas</a>

<a href="./assets/UserResearch.pdf" target="_blank">View User Research</a>

<a href="./assets/Site-map.png" target="_blank">Site Map</a>

<a href="./assets/Lofi-design.png" target="_blank">Lofi designs</a>

# Features Added Recently

- Admin dashboard improvements:

    - Approve, reject, or request updates for pending events.

    - Track events that need amendments and notify organisers.

    - View event statistics for better insights.

    - Full user management (create/update/delete users, including admin roles).

- Organiser workflow enhancements:

    - Create new events with categories, dates, times, and prices.

    - Edit events after admin requests changes.

    - Receive “needs update” comments and amend events accordingly.

- Frontend improvements:

    - Protected routes based on role (attendee, organiser, admin).

    - Dynamic forms for event creation with category suggestions.

    - Real-time updates to event lists after admin actions.

# Testing and Performance Checks

- EsLint and Prettier
- Lighthouse performance and Accessbiity
- 4 tests on AddNewEvent and EventForm

# Features Coming Soon!!

- PWA 