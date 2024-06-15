# Enhanced Authentication System for Courses (Mongoose JWT Backend)

This project implements a secure authentication system and CRUD operations for managing courses, categories, and reviews using Node.js, Express, Mongoose, and JWT (JSON Web Tokens).

## Getting Started

To run the project locally:

1. Clone the repository:

2. Install dependencies:

3. Set up environment variables:
- Create a `.env` file in the root directory.
- Add the following variables:
  ```
  JWT_SECRET=<your-secret-key>
  MONGODB_URI=<your-mongodb-uri>
  ```

4. Start the development server:

## User Authentication and Authorization

- Implement JWT-based authentication for user login.
- Securely hash and manage passwords.
- Implement user registration with validation (username uniqueness, strong password).
- Implement role-based access control (user vs admin).
- Implement password change functionality with history validation.

## Models and Schemas

### User Model

- _id, username, email, password, role
- Implement password hashing and validation rules.

### Course Model

- _id, title, instructor, categoryId, price, tags, startDate, endDate, language, provider, durationInWeeks, details, createdBy

### Category Model

- _id, name, createdBy

### Review Model

- _id, courseId, rating, review, createdBy

## Endpoints and Routes

### User Authentication

- /api/auth/register (POST)
- /api/auth/login (POST)
- /api/auth/change-password (POST)

### Course Operations

- /api/courses (POST - Admin only)
- /api/courses/:courseId (PUT - Admin only)
- /api/courses/:courseId/reviews (GET - Public)

### Category Operations

- /api/categories (POST - Admin only)
- /api/categories (GET - Public)

### Review Operations

- /api/reviews (POST - User only)

## Query Options for Courses

- Implement filtering and pagination for retrieving courses based on various parameters (e.g., price range, start date, tags).
- User Login:

Username: zibran hasan sourav

Password: Passw0Rd

Admin Login:

Username: zibran hasan

Password:Passw0rd
