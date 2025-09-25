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
|                         |        |                                                  |
|-------------------------|--------|--------------------------------------------------|
| Action                  | Method | URL                                              |
| Test server             | GET	   | http://localhost:5050/                           |
| Register	              | POST   | http://localhost:5050/auth/register              |
| Login	                  | POST   | http://localhost:5050/auth/login                 |
| Logout                  | POST   | http://localhost:5050/auth/logout                |
| User Dashboard          | GET	   | http://localhost:5050/user-dashboard             |
| Organiser Dashboard     | GET	   | http://localhost:5050/organiser-dashboard        |
| Admin Dashboard         | GET	   | http://localhost:5050//admin-dashboard           |
| List all events         | GET	   | http://localhost:5050/event                      |
| Single event            | GET    | http://localhost:5050/event/:eventId             |
| Fetch all saved events  | GET	   | http://localhost:5050/users/me                   |
| Save event to fav       | POST   | http://localhost:5050/users/favorites/:id        |
| Remove event to fav     | DELETE | http://localhost:5050/users/favorites/:eventId   |
| Book an event           | POST   | http://localhost:5050/users/bookings/:eventId    |
| Cancel an event         | DELETE | http://localhost:5050/users/bookings/:bookingId  |




