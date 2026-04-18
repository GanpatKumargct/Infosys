# WellNest - Smart Health & Habit Companion


WellNest is a modern, full-stack healthcare management platform designed to streamline interactions between patients, doctors, and hospital staff. The system provides tools for health tracking, appointment scheduling, medical record management, and automated report generation.

## 🏗️ System Architecture

The project follows a decoupled **Frontend-Backend** architecture:

- **Frontend:** A responsive Single Page Application (SPA) built with React and Vite. It communicates with the backend via a RESTful API.
- **Backend:** A robust Spring Boot application that handles business logic, security, database persistence, and external services (Email/PDF).
- **Database:** A relational MySQL database used for persistent storage of user profiles, health logs, and appointments.

---

## 🛠️ Tech Stack

### Backend
- **Core:** Java 17, Spring Boot 3.2.3
- **Security:** Spring Security, JWT (Stateless Authentication)
- **Database:** MySQL, Spring Data JPA (Hibernate)
- **Email:** Spring Mail (Gmail SMTP Integration)
- **Reporting:** iText 7 (PDF Generation)
- **Documentation:** SpringDoc OpenAPI (Swagger UI)

### Frontend
- **Core:** React 19, Vite
- **Routing:** React Router Dom v7
- **Styling:** CSS3, Lucide React (Icons)
- **Data Visualization:** Recharts
- **API Client:** Axios

---

## 🚀 Key Features

### 👤 For Patients
- **Personal Dashboard:** View health summaries and upcoming appointments.
- **Health Logger:** Log daily activities and track habits.
- **Appointment Management:** Book and view appointments with doctors.
- **Medical Records:** Access and download health reports in PDF format.

### 👨‍⚕️ For Doctors
- **Appointment Tracking:** Manage and review patient appointments.
- **Patient Overview:** Access health logs and records of assigned patients.

### 🏢 For Receptionists & Admin
- **Receptionist:** Streamline appointment workflows.
- **Admin Panel:** Manage user accounts, specialized doctor/patient registrations, and system maintenance.

---

## 👥 The Builders (Team WellNest)

| Role | Members |
| :--- | :--- |
| **Backend & Database** | Ganpat Kumar, Gandhi Priyal |
| **Frontend & UI/UX** | Sumit Borkar, Vishnupriya |

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17 or higher
- Node.js (v18+) & npm
- MySQL Server

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Create a MySQL database named `wellnest`.
3. Update `src/main/resources/application.properties` with your MySQL credentials.
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
Infosys/
├── backend/            # Spring Boot Application
│   ├── src/            # Java Source Code
│   ├── pom.xml         # Maven Dependencies
│   └── README.md       # Backend Specific Docs
├── frontend/           # React + Vite Application
│   ├── src/            # Components, Pages, Services
│   ├── package.json    # NPM Dependencies
│   └── README.md       # Frontend Specific Docs
└── README.md           # Project Root (This file)
```

---

© 2026 Team WellNest.
