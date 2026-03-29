# Secure Scalable Task Manager

A full-stack application with secure JWT authentication, role-based access control, and CRUD operations for task management. Built with Express.js, PostgreSQL, and React.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [Frontend Setup](#frontend-setup)
- [Scalability Notes](#scalability-notes)
- [Security Practices](#security-practices)
- [Bonus Features](#bonus-features)
- [License](#license)

## ✨ Features

### Backend (Primary Focus)
- ✅ User registration & login with password hashing (bcrypt)
- ✅ JWT authentication with token expiration (24h)
- ✅ Role-based access control (user vs admin)
- ✅ CRUD APIs for task management
- ✅ API versioning (`/api/v1/`)
- ✅ Comprehensive error handling and input validation
- ✅ Swagger API documentation
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Security middleware (Helmet, CORS)
- ✅ Request logging with Morgan

### Frontend (Supportive)
- ✅ React.js with React Router
- ✅ User authentication (Register/Login)
- ✅ Protected dashboard route
- ✅ Full CRUD UI for tasks
- ✅ Error/success message handling
- ✅ Responsive design with CSS

### Security & Scalability
- ✅ Secure JWT token handling
- ✅ Input sanitization & validation
- ✅ Password hashing with bcrypt (salt rounds: 12)
- ✅ Scalable project structure for new modules
- ✅ Docker setup for containerization

## 🛠 Tech Stack

### Backend
- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Validation**: express-validator
- **Documentation**: Swagger UI
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Create React App

### DevOps
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection config
│   │   └── swagger.js        # Swagger documentation setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification & role checks
│   │   └── validation.middleware.js # Input validation
│   ├── models/
│   │   ├── user.model.js    # User schema with password hashing
│   │   └── task.model.js    # Task schema
│   ├── routes/
│   │   ├── auth.routes.js   # Auth endpoints
│   │   ├── task.routes.js   # Task CRUD endpoints
│   │   └── user.routes.js   # User management (admin only)
│   ├── utils/
│   │   └── constants.js     # Application constants
│   ├── app.js               # Express application entry
│   ├── .env.example         # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Docker (optional, for containerization)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd secure-scalable-backend-systems
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskmanager;

# Exit
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`
API Documentation: `http://localhost:5000/api-docs`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/tasks` | Create new task | Yes |
| GET | `/api/v1/tasks` | Get all tasks (with filters) | Yes |
| GET | `/api/v1/tasks/:id` | Get single task | Yes |
| PUT | `/api/v1/tasks/:id` | Update task | Yes |
| DELETE | `/api/v1/tasks/:id` | Delete task | Yes |

### User Endpoints (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users | Yes (Admin) |
| GET | `/api/v1/users/:id` | Get user by ID | Yes (Admin) |
| PUT | `/api/v1/users/:id/role` | Update user role | Yes (Admin) |

### Request/Response Examples

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Create Task
```bash
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write API documentation",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## 🔐 Authentication Flow

1. **Registration**: User submits name, email, and password
   - Password hashed with bcrypt (12 salt rounds)
   - JWT token generated and returned

2. **Login**: User submits email and password
   - Credentials verified against database
   - JWT token generated with user info (id, email, role)
   - Token expires in 24 hours

3. **Protected Routes**: 
   - Token sent in `Authorization: Bearer <token>` header
   - Middleware verifies token validity
   - Role checked for admin-only endpoints

4. **Token Refresh**: User must re-login after token expiration

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- User has many Tasks (1:N)
- Task belongs to User (N:1)
- Regular users can only access their own tasks
- Admins can access all tasks and users

## 🎨 Frontend Setup

The React frontend provides:

1. **Authentication Pages**
   - Register: Create new account
   - Login: Existing user authentication
   - JWT token stored in localStorage

2. **Dashboard**
   - Protected route (requires authentication)
   - User profile display
   - Quick stats and navigation

3. **Task Management**
   - Create, read, update, delete tasks
   - Filter by status and priority
   - Modal-based forms for better UX
   - Error/success alerts

4. **Navigation**
   - Responsive navbar with auth state
   - Role-based UI elements
   - Logout functionality

## 📈 Scalability Notes

### Current Architecture
The application follows a modular monolithic architecture suitable for small to medium scale:

- Separation of concerns (controllers, models, routes)
- Database connection pooling
- Environment-based configuration

### Scaling Strategies

#### 1. Horizontal Scaling
- Run multiple server instances behind a load balancer
- Use process managers like PM2
- Stateless application design (no server-side sessions)

#### 2. Database Scaling
- Read replicas for heavy read operations
- Connection pooling (already implemented)
- Database indexing on frequently queried fields
- Sharding for very large datasets

#### 3. Caching
- Redis for session management and caching
- Cache frequently accessed data (user profiles, task lists)
- Reduce database load

#### 4. Microservices
- Split into services: Auth Service, Task Service, User Service
- Each service with its own database
- API Gateway for routing
- Service-to-service communication via message queues

#### 5. Additional Optimizations
- CDN for static assets
- Rate limiting (implemented with express-rate-limit)
- Request compression (gzip)
- Database query optimization

## 🔒 Security Practices

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - Passwords never stored in plain text
   - Minimum password length enforced

2. **JWT Security**
   - Tokens expire after 24 hours
   - Secret key stored in environment variables
   - Tokens contain minimal user info (id, email, role)

3. **Input Validation**
   - express-validator for request validation
   - SQL injection prevention via Sequelize ORM
   - XSS protection via Helmet middleware

4. **API Security**
   - Helmet for security headers
   - CORS properly configured
   - Rate limiting on auth endpoints

5. **Environment Security**
   - Sensitive data in .env files (not committed)
   - NODE_ENV check before exposing stack traces

## 🎁 Bonus Features

### Docker Setup
Containerize the application for easy deployment:

```bash
# Build and start all services
docker-compose up --build

# Access application
Backend: http://localhost:5000
Frontend: http://localhost:3000
PostgreSQL: localhost:5432
```

### Logging
- Morgan for HTTP request logging
- Structured logging with Winston (ready to implement)
- Log rotation for production

### Testing
- Jest setup for unit testing
- Supertest for API testing
- Test database configuration ready

### Rate Limiting
Can be easily added:
```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});
```

## 📄 License

This project is licensed under the MIT License.

---

## 📝 Additional Notes

### Creating an Admin User

To create an admin user, manually update the role in database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Environment Variables for Production

```env
NODE_ENV=production
JWT_SECRET=strong_random_string_min_32_chars
DB_HOST=your_production_db_host
DB_SSL=true
```

### Health Check Endpoint

```bash
GET /health
```

Returns server status and timestamp for monitoring.

---

**Built with ❤️ for PrimeTrade AI Backend Developer Internship**
"# secure-scalable-backend-systemss" 
