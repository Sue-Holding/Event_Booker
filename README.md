# Event Booker

## Hi! This is my exam project for Advanced JavaScript.

I’m building an event booking application from scratch that will cover:

- UX research & design – planning user flows and wireframes before development.

- Full backend functionality – built with Node.js, Express, and MongoDB, including authentication, data models, and a REST API.

- Frontend – built with React, connected to the backend for browsing, booking, and managing events.

- Admin features – approve/reject events, manage users, and view event statistics.

- Organiser workflow – create and edit events, including handling admin feedback (“needs update”) before events are approved.

This project is a work in progress – I’ll be updating the repo as I go.

🚀 Check out the deployed version here: Eventure Live

Thanks for dropping by! 🙌

## Endpoints  

<a href="./assets/endpoints.png" target="_blank">View Endpoints</a>
|                                 |        |                                                  |       |
|---------------------------------|--------|--------------------------------------------------|-------|
| Action                          | Method | URL                                              | Notes |
| Test server                     | GET	   | http://localhost:5050/                           |       |
| AUTH                            |        |                                                  |               |
| Register	                      | POST   | http://localhost:5050/auth/register              ||
| Login	                          | POST   | http://localhost:5050/auth/login                 ||
| Logout                          | POST   | http://localhost:5050/auth/logout                ||
| User Dashboard                  | GET	   | http://localhost:5050/user-dashboard             ||
| Organiser Dashboard             | GET	   | http://localhost:5050/organiser-dashboard        ||
| Admin Dashboard                 | GET	   | http://localhost:5050//admin-dashboard           ||
| EVENTS                          |        |                                                  |               |
| List all events                 | GET	   | http://localhost:5050/event                      ||
| Single event                    | GET    | http://localhost:5050/event/:eventId             ||
| USER / ATTENDEE                 |        |                                                  |               |
| Fetch all saved events          | GET	   | http://localhost:5050/users/me                   ||
| Save event to fav               | POST   | http://localhost:5050/users/favorites/:id        ||
| Remove event to fav             | DELETE | http://localhost:5050/users/favorites/:eventId   ||
| Book an event                   | POST   | http://localhost:5050/users/bookings/:eventId    ||
| Cancel an event                 | DELETE | http://localhost:5050/users/bookings/:bookingId  ||
| ORGANISER ONLY                  |        |                                                  |               |
| Create new event (organiser)	  | POST   | http://localhost:5050/organiser/events           | Needs admin approval workflow |
| Edit existing event (organiser) |	PUT    | http://localhost:5050/organiser/events/:id       | Optional amendment function |
| Delete event (organiser)	      | DELETE | http://localhost:5050/organiser/events/:id       | Optional |
| ADMIN ONLY                      |        |                                                  |               |
| Get all events / stats          | GET    | http://localhost:5050/admin/events               | Get events and stats    |
| Approve / reject event (admin)  |	POST   | http://localhost:5050/admin/events/:id/approve   | Admin approves pending events |
| Manage users (view list)	      | GET	   | http://localhost:5050/admin/users                | Admin can view all users |
| Create new admin user	          | POST   | http://localhost:5050/admin/users                | Create new users |
| Update user info	              | PUT    | http://localhost:5050/admin/users/:id            | Admin can update user settings |
| Delete user                     |	DELETE | http://localhost:5050/admin/users/:id            | Admin deletes user |


# Persona and UX Research

<!-- ![Personas](./assets/Personas.png) -->
<a href="./assets/Personas.png" target="_blank">View Personas</a>

<a href="./assets/UserResearch.pdf" target="_blank">View User Research</a>

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