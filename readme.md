# Patient Management System

A comprehensive patient management system using Next.js, Prisma with SQLite, and shadcn/ui components. This system will allow doctors to manage patients and for patients to book appointments and view recommendations.

## System Overview

I've created a comprehensive patient management system with the following features:

### For Doctors

1. **Patient Management**: Add, view, and manage patient records
2. **Appointment Scheduling**: View and manage appointments with patients
3. **Medical Recommendations**: Create and track recommendations for patients
4. **Dashboard**: Overview of daily activities, upcoming appointments, and patient statistics

### For Patients

1. **Appointment Booking**: Schedule appointments with doctors
2. **View Recommendations**: Access medical recommendations from doctors
3. **Patient Portal**: Personal dashboard to manage health information

### Technical Implementation

1. **Database Structure**

1. Used Prisma with SQLite for data persistence
1. Created models for Users, Doctors, Patients, Appointments, and Recommendations

1. **Authentication**

1. Implemented user registration and login with role-based access (doctor/patient)
1. Password hashing for security

1. **API Endpoints**

1. Created RESTful API routes for appointments, recommendations, and patient management
1. Implemented proper error

## Installation

```bash
npm i --legacy-peer-deps
```

## Run with

```bash
npm run dev
```

## Create tables with sqlite

```bash
npx prisma migrate dev --name init
```

Create secret

```bash
openssl rand -base64 32
```
