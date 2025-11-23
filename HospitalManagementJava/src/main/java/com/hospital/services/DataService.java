package com.hospital.services;

import com.hospital.models.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class DataService {
    private static DataService instance;
    private List<User> users;
    private List<Patient> patients;
    private List<Doctor> doctors;
    private List<Appointment> appointments;

    private DataService() {
        users = new ArrayList<>();
        patients = new ArrayList<>();
        doctors = new ArrayList<>();
        appointments = new ArrayList<>();
        
        // Seed data
        users.add(new User("1", "admin@hospital.com", Role.ADMIN, "Admin User"));
        users.add(new User("2", "doctor@hospital.com", Role.DOCTOR, "Dr. Smith"));
        
        patients.add(new Patient("1", "John Doe", "john@example.com", 30, "Male", "O+", "1234567890", "123 Main St", "None", "2023-10-01"));
        patients.add(new Patient("2", "Jane Smith", "jane@example.com", 25, "Female", "A+", "0987654321", "456 Oak St", "Asthma", "2023-10-05"));

        doctors.add(new Doctor("1", "Dr. Smith", "doctor@hospital.com", "Cardiology", "1112223333", "Mon-Fri 9-5"));
        doctors.add(new Doctor("2", "Dr. Jones", "jones@hospital.com", "Pediatrics", "4445556666", "Mon-Wed 9-5"));

        appointments.add(new Appointment("1", "1", "1", "John Doe", "Dr. Smith", "2023-10-20", "10:00", "Scheduled", "Routine Checkup"));
    }

    public static DataService getInstance() {
        if (instance == null) {
            instance = new DataService();
        }
        return instance;
    }

    public User authenticate(String email, String password) {
        // Simple mock authentication
        return users.stream()
                .filter(u -> u.getEmail().equals(email)) // In real app, check password too
                .findFirst()
                .orElse(null);
    }

    public List<Patient> getPatients() { return patients; }
    public void addPatient(Patient patient) { patients.add(patient); }

    public List<Doctor> getDoctors() { return doctors; }
    public void addDoctor(Doctor doctor) { doctors.add(doctor); }

    public List<Appointment> getAppointments() { return appointments; }
    public void addAppointment(Appointment appointment) { appointments.add(appointment); }
    
    public DashboardStats getStats() {
        // Mock stats
        return new DashboardStats(patients.size(), doctors.size(), appointments.size(), 15000);
    }
    
    // Inner class for stats if not defined elsewhere
    public static class DashboardStats {
        public int totalPatients;
        public int totalDoctors;
        public int activeAppointments;
        public double revenue;

        public DashboardStats(int totalPatients, int totalDoctors, int activeAppointments, double revenue) {
            this.totalPatients = totalPatients;
            this.totalDoctors = totalDoctors;
            this.activeAppointments = activeAppointments;
            this.revenue = revenue;
        }
    }
}
