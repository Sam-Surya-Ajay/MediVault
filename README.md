# MediVault - Healthcare Management System

MediVault is a comprehensive healthcare management system that connects patients with doctors. It provides features for managing medical records, appointments, prescriptions, and real-time chat between patients and doctors.

## Project Structure

The project consists of two main parts:

1. **Spring Boot Backend** (`fsd_final/medivaultsb/`): Handles API requests, database operations, and business logic.
2. **React Frontend** (`fsd_final/medivault-connect-care/`): Provides the user interface for patients and doctors.

## Technologies Used

### Backend

- Java 21
- Spring Boot 3.5.0
- Spring Security with JWT Authentication
- Spring Data JPA
- PostgreSQL (Aiven Cloud)
- WebSockets for real-time communication

### Frontend

- React
- React Router
- Axios for API calls
- STOMP/SockJS for WebSocket communication
- Tailwind CSS + shadcn/ui

## Setup Instructions

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL database (local or Aiven Cloud)

### Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in your credentials in `.env`:

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL JDBC connection string |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `MAIL_USERNAME` | Gmail address for sending emails |
| `MAIL_PASSWORD` | Gmail app password |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) |

### Backend Setup

1. Open the Spring Boot project in your IDE
2. Ensure your `.env` file is configured (see above)
3. Run the Spring Boot application:

```bash
cd fsd_final/medivaultsb
./mvnw spring-boot:run
```

### Frontend Setup

1. Install dependencies:

```bash
cd fsd_final/medivault-connect-care
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Access the application at http://localhost:5173

## Features

### Patient Features

- Register and login
- Upload and manage medical records
- Book appointments with doctors
- View prescriptions
- Chat with doctors

### Doctor Features

- Register and login
- View patient medical records
- Manage appointment requests
- Create prescriptions
- Chat with patients

## API Documentation

### Authentication

- `POST /api/auth/register`: Register a new user (patient or doctor)
- `POST /api/auth/login`: Login and get JWT token

### Patient API

- `GET /api/patient/doctors`: Get list of doctors
- `POST /api/patient/records`: Upload medical record
- `GET /api/patient/records`: Get all patient records
- `GET /api/patient/records/{id}/download`: Download a specific record
- `POST /api/patient/appointments`: Book an appointment
- `GET /api/patient/appointments`: Get all patient appointments
- `GET /api/patient/prescriptions`: Get all prescriptions

### Doctor API

- `GET /api/doctor/appointments/pending`: Get pending appointment requests
- `PUT /api/doctor/appointments/{id}/approve`: Approve an appointment
- `PUT /api/doctor/appointments/{id}/reject`: Reject an appointment
- `GET /api/doctor/dashboard`: Get dashboard data
- `GET /api/doctor/patients/{id}/records`: Get patient medical records

### Chat API

- WebSocket endpoint: `/ws`
- STOMP destination prefix: `/app`
- STOMP broker prefix: `/topic`

## License

This project is licensed under the MIT License.
