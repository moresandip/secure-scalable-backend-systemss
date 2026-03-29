# For running without Docker

# 1. Install PostgreSQL and create database
createdb taskmanager

# 2. Setup backend
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev

# 3. Setup frontend (in a new terminal)
cd frontend
npm install
npm start

# Access the application:
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
# Frontend: http://localhost:3000
