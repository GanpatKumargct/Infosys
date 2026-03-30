# WellNest - Smart Health & Habit Companion

## Project Structure
- `backend/`: Spring Boot Application (Java 17+, Maven, MySQL)
- `frontend/`: React Application (Vite, npm)

## Prerequisites
- Java 17+
- Maven
- Node.js & npm
- MySQL Server

## Getting Started

### 1. Database Setup
Create a MySQL database named `wellnest`.
Update `backend/src/main/resources/application.properties` with your credentials if needed.

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
mvn spring-boot:run
```
The backend will start at `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

## Features
- **Role-Based Auth**: Patient, Doctor, Receptionist, Admin.
- **Separate Registration**: Dedicated pages for each role.
- **Health Tracking**: Log activities (Workouts, Meals, etc.).
- **Appointments**: Schedule and view appointments.
