package com.hospital.models;

public class Patient {
    private String id;
    private String name;
    private String email;
    private int age;
    private String gender;
    private String bloodType;
    private String contact;
    private String address;
    private String medicalHistory;
    private String lastVisit;
    private String password;

    public Patient(String id, String name, String email, int age, String gender, String bloodType, 
                   String contact, String address, String medicalHistory, String lastVisit) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.bloodType = bloodType;
        this.contact = contact;
        this.address = address;
        this.medicalHistory = medicalHistory;
        this.lastVisit = lastVisit;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }

    public String getLastVisit() { return lastVisit; }
    public void setLastVisit(String lastVisit) { this.lastVisit = lastVisit; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
