# Event Booker

## Hi! This is my exam project for Advanced JavaScript.

I’m building an event booking application from scratch that will cover:

- UX research & design – planning user flows and wireframes before development.

- Full backend functionality – built with Node.js, Express, and MongoDB, including authentication, data models, and a REST API.

- Frontend – built with React, connected to the backend for browsing, booking, and managing events.

This project is still a work in progress – I’ll be updating the repo as I go.

🚀 Come back soon to see how I’ve been getting on and for the deployed version!

Thanks for dropping by! 🙌

## Endpoints  

<a href="./assets/endpoints.png" target="_blank">View Endpoints</a>
|                                 |        |                                                  |       |
|---------------------------------|--------|--------------------------------------------------|-------|
| Action                          | Method | URL                                              | Notes |
| Test server                     | GET	   | http://localhost:5050/                           |       |
| Register	                      | POST   | http://localhost:5050/auth/register              ||
| Login	                          | POST   | http://localhost:5050/auth/login                 ||
| Logout                          | POST   | http://localhost:5050/auth/logout                ||
| User Dashboard                  | GET	   | http://localhost:5050/user-dashboard             ||
| Organiser Dashboard             | GET	   | http://localhost:5050/organiser-dashboard        ||
| Admin Dashboard                 | GET	   | http://localhost:5050//admin-dashboard           ||
| List all events                 | GET	   | http://localhost:5050/event                      ||
| Single event                    | GET    | http://localhost:5050/event/:eventId             ||
| Fetch all saved events          | GET	   | http://localhost:5050/users/me                   ||
| Save event to fav               | POST   | http://localhost:5050/users/favorites/:id        ||
| Remove event to fav             | DELETE | http://localhost:5050/users/favorites/:eventId   ||
| Book an event                   | POST   | http://localhost:5050/users/bookings/:eventId    ||
| Cancel an event                 | DELETE | http://localhost:5050/users/bookings/:bookingId  ||
| Create new event (organiser)	  | POST   | http://localhost:5050/organiser/events           | Needs admin approval workflow |
| Edit existing event (organiser) |	PUT    | http://localhost:5050/organiser/events/:id       | Optional amendment function |
| Delete event (organiser)	      | DELETE | http://localhost:5050/organiser/events/:id       | Optional |
| Approve / reject event (admin)  |	PATCH  | http://localhost:5050/admin/events/:id/approve   | Admin approves pending events |
| Manage users (view list)	      | GET	   | http://localhost:5050/admin/users                | Admin can view all users |
| Update user info	              | PUT    | http://localhost:5050/admin/users/:id            | Admin can update user settings |
| Delete user                     |	DELETE | http://localhost:5050/admin/users/:id            | Admin deletes user |
| Create new admin user           | POST   | http://localhost:5050/admin/users                | Admin-only access |


# Persona and UX Research

<!-- ![Personas](./assets/Personas.png) -->
<a href="./assets/Personas.png" target="_blank">View Personas</a>

<a href="./assets/UserResearch.pdf" target="_blank">View User Research</a>