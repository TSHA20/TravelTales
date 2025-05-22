# TravelTales

## TravelTales Backend------------------------------------------------
A secure RESTful API for the TravelTales blogging platform. Users can register, log in, create blog posts about countries they’ve visited, and interact with other users through likes, comments, and follows. The system is built with Node.js, Express, and SQLite, and implements strong security features including JWT authentication and CSRF protection.

## Security Highlights
- JWT in HttpOnly cookies for secure session management.
- Double Submit Cookie CSRF protection with custom middleware.
- Authorization middleware to restrict and validate access.
- All sensitive endpoints are protected using `authMiddleware` and `csrfMiddleware`.

## Usage Notes
After login, the backend sets JWT and CSRF cookies.
Include withCredentials: true and x-csrf-token header in all protected frontend requests

## Tech Stack
Node.js + Express.js
SQLite3 (lightweight relational database)
JWT + bcrypt
cookie-parser, cors
Custom middleware for auth + CSRF
