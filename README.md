# Hospital Management System

A full-stack hospital management system with a Django REST API and a React frontend. The application supports role-based workflows for administrators, doctors, and patients.

## Features

- JWT authentication and patient registration
- Doctor profiles and availability management
- Appointment booking, approval, completion, and cancellation
- Patient and doctor dashboards
- Prescription creation and viewing
- Admin management of doctors, patients, and appointments
- MySQL database support

## Technology Stack

- **Backend:** Python, Django, Django REST Framework, Simple JWT
- **Frontend:** React, Vite, Axios, Tailwind CSS
- **Database:** MySQL

## Project Structure

```text
backend/     Django project and REST API
frontend/    React client application
.env.example Environment variable template
```

## Prerequisites

- Python 3.13 or compatible Python 3 version
- Node.js and npm
- MySQL Server

## Backend Setup

From the repository root, create a local environment file:

```powershell
Copy-Item .env.example .env
```

Update `.env` with a secure Django secret and the password for the MySQL user:

```env
DJANGO_SECRET_KEY=your-long-random-secret
DB_PASSWORD=your-database-password
```

Create the database and user in MySQL, then install the backend dependencies:

```powershell
Set-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/`.

The default database configuration expects:

```text
Database: hospital_db
User: hms_user
Host: 127.0.0.1
Port: 3306
```

## Frontend Setup

In a second terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser. The frontend calls the backend at `http://127.0.0.1:8000/api/`.

## Useful Commands

### Backend

```powershell
python manage.py check
python manage.py test
```

### Frontend

```powershell
npm run lint
npm run build
npm run preview
```

## API Endpoints

| Area | Endpoint |
| --- | --- |
| Authentication | `/api/token/`, `/api/token/refresh/` |
| Current user | `/api/me/` |
| Registration | `/api/register/` |
| Doctors | `/api/doctors/` |
| Doctor availability | `/api/doctor-availability/` |
| Patient profile | `/api/patient-profile/` |
| Appointments | `/api/appointments/` |
| Prescriptions | `/api/prescriptions/` |
| Django admin | `/admin/` |

## Security

- Never commit `.env` or other secret files.
- Use `.env.example` only as a configuration template.
- Use a unique production `DJANGO_SECRET_KEY`.
- Rotate database credentials before production deployment.
- Set production hosts, CORS origins, and `DEBUG` explicitly for deployment.

## License

This project does not currently specify a license.
