# WellNest Backend

## Prerequisites
- Java 17+
- Maven
- MySQL Database

## Setup
1. Create a MySQL database named `wellnest`.
2. Configure your database username and password in `src/main/resources/application.properties` if they are different from `root/root`.

## Running the Application
```bash
mvn spring-boot:run
```

## API Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Patient**: `/api/patient/activities`, `/api/patient/appointments`
- **Doctor**: `/api/doctor/appointments`
- **Receptionist**: `/api/receptionist/appointments`
- **Admin**: `/api/admin/users`
