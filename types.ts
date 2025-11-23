export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  email: string; // Changed from username to email for login
  role: Role;
  name: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  contact: string;
  address: string;
  medicalHistory: string;
  lastVisit: string;
  password?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  contact: string;
  availability: string;
  password?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string; // Denormalized for easier display
  doctorName: string;  // Denormalized for easier display
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  activeAppointments: number;
  revenue: number;
}