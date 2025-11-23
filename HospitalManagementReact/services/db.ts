import { Patient, Doctor, Appointment } from '../types';

// Seed Data
const SEED_PATIENTS: Patient[] = [
  { id: '1', name: 'Alice Spring', email: 'alice@care.com', age: 34, gender: 'Female', bloodType: 'O+', contact: '555-0101', address: '123 Blossom Ln', medicalHistory: 'None', lastVisit: '2023-10-01', password: '123' },
  { id: '2', name: 'Bob River', email: 'bob@care.com', age: 45, gender: 'Male', bloodType: 'A-', contact: '555-0102', address: '456 Stream Rd', medicalHistory: 'Hypertension', lastVisit: '2023-09-15', password: '123' },
  { id: '3', name: 'Charlie Cloud', email: 'charlie@care.com', age: 28, gender: 'Other', bloodType: 'B+', contact: '555-0103', address: '789 Sky Ave', medicalHistory: 'Asthma', lastVisit: '2023-10-20', password: '123' },
  { id: '4', name: 'Daisy Hill', email: 'daisy@care.com', age: 62, gender: 'Female', bloodType: 'AB+', contact: '555-0104', address: '101 Meadow Blvd', medicalHistory: 'Diabetes', lastVisit: '2023-10-22', password: '123' },
];

const SEED_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Pastel', email: 'sarah@pastel.com', specialty: 'Cardiology', contact: '555-1001', availability: 'Mon-Fri', password: '123' },
  { id: '2', name: 'Dr. John Teal', email: 'john@pastel.com', specialty: 'Pediatrics', contact: '555-1002', availability: 'Tue-Sat', password: '123' },
  { id: '3', name: 'Dr. Emily Rose', email: 'emily@pastel.com', specialty: 'General Medicine', contact: '555-1003', availability: 'Mon, Wed, Fri', password: '123' },
];

const SEED_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: '1', doctorId: '1', patientName: 'Alice Spring', doctorName: 'Dr. Sarah Pastel', date: '2023-10-25', time: '09:00', status: 'Scheduled', notes: 'Annual checkup' },
  { id: '2', patientId: '2', doctorId: '2', patientName: 'Bob River', doctorName: 'Dr. John Teal', date: '2023-10-25', time: '10:30', status: 'Completed', notes: 'Follow up' },
  { id: '3', patientId: '3', doctorId: '1', patientName: 'Charlie Cloud', doctorName: 'Dr. Sarah Pastel', date: '2023-10-26', time: '14:00', status: 'Scheduled' },
];

class MockDB {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('hms_patients')) {
      localStorage.setItem('hms_patients', JSON.stringify(SEED_PATIENTS));
    }
    if (!localStorage.getItem('hms_doctors')) {
      localStorage.setItem('hms_doctors', JSON.stringify(SEED_DOCTORS));
    }
    if (!localStorage.getItem('hms_appointments')) {
      localStorage.setItem('hms_appointments', JSON.stringify(SEED_APPOINTMENTS));
    }
  }

  getPatients(): Patient[] {
    return JSON.parse(localStorage.getItem('hms_patients') || '[]');
  }

  addPatient(patient: Patient) {
    const patients = this.getPatients();
    patients.push(patient);
    localStorage.setItem('hms_patients', JSON.stringify(patients));
  }

  getDoctors(): Doctor[] {
    return JSON.parse(localStorage.getItem('hms_doctors') || '[]');
  }

  addDoctor(doctor: Doctor) {
    const doctors = this.getDoctors();
    doctors.push(doctor);
    localStorage.setItem('hms_doctors', JSON.stringify(doctors));
  }

  updateDoctor(updatedDoctor: Doctor) {
    const doctors = this.getDoctors();
    const index = doctors.findIndex(d => d.id === updatedDoctor.id);
    if (index !== -1) {
      doctors[index] = updatedDoctor;
      localStorage.setItem('hms_doctors', JSON.stringify(doctors));
    }
  }

  deleteDoctor(id: string) {
    const doctors = this.getDoctors().filter(d => d.id !== id);
    localStorage.setItem('hms_doctors', JSON.stringify(doctors));
  }

  getAppointments(): Appointment[] {
    return JSON.parse(localStorage.getItem('hms_appointments') || '[]');
  }

  addAppointment(appt: Appointment) {
    const appts = this.getAppointments();
    appts.push(appt);
    localStorage.setItem('hms_appointments', JSON.stringify(appts));
  }

  updateAppointmentStatus(id: string, status: Appointment['status']) {
    const appts = this.getAppointments();
    const idx = appts.findIndex(a => a.id === id);
    if (idx !== -1) {
      appts[idx].status = status;
      localStorage.setItem('hms_appointments', JSON.stringify(appts));
    }
  }
}

export const db = new MockDB();