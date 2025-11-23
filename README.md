# PastelCare Hospital Management System

A modern, responsive, and fully functional Hospital Management System (HMS) built with React, TypeScript, and Vite. The project features a clean pastel aesthetic with a fully integrated dark mode ("Sombre" mode).

## 🚀 Features

- **Role-Based Access Control**: Distinct dashboards and capabilities for Admins, Doctors, Staff, and Patients.
- **Modern UI/UX**:
  - Pastel color palette for a calming medical environment.
  - "Sombre" Dark Mode (High contrast black/dark gray).
  - Responsive design using Tailwind CSS.
- **Patient Management**:
  - Register new patients with auto-generated passwords.
  - Manage demographics, blood type, and medical history.
- **Doctor Dashboard**:
  - View upcoming schedule.
  - "Next Patient" highlight card.
  - Queue management.
- **Appointment Scheduling**:
  - Book appointments.
  - Status tracking (Scheduled, Completed, Cancelled).
- **Staff Administration**:
  - CRUD operations for medical staff.
- **Local Persistence**: Uses `localStorage` to save data without needing a backend server for the demo.

## 🛠️ Installation & Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Locally**
    ```bash
    npm run dev
    ```

3.  **Open Browser**
    Visit the URL shown in the terminal (usually `http://localhost:5173`).

## 🔑 Demo Credentials

Use the following credentials to log in and test different user roles:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pastel.com` | `admin` | Full access (Patients, Staff, Appointments, Stats) |
| **Doctor** | `sarah@pastel.com` | `123` | Doctor Dashboard, My Patients, Schedule |
| **Staff** | `staff@pastel.com` | `staff` | Patient Management, General Appointments |
| **Patient** | `alice@care.com` | `123` | Personal Dashboard, My History, Book Appointment |

## 💻 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via CDN for portability)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Router**: React Router DOM

## 📂 Project Structure

- `index.html`: Entry point (Tailwind config included here).
- `App.tsx`: Main application logic and routing.
- `types.ts`: TypeScript interfaces for User, Patient, Doctor, etc.
- `services/db.ts`: Mock database service using LocalStorage.
- `pages/`: Individual screen components (Login, Dashboard, etc.).
- `components/`: Reusable UI components (Layout, Sidebar).
