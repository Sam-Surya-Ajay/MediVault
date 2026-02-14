package com.nigga.medivaultsb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, unique = true, length = 150)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(length = 20)
    private String phone;
    
    @Column(nullable = false, length = 20)
    private String role;
    
    @Column(length = 10)
    private String gender;
    
    private Integer age;
    
    // Doctor-specific fields
    @Column(length = 100)
    private String specialty;
    
    @Column(name = "license_number", length = 50)
    private String licenseNumber;
    
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    private String bio;
    
    @Column(name = "clinic_name", length = 100)
    private String clinicName;
    
    @Column(name = "clinic_location", length = 200)
    private String clinicLocation;
    
    @Column(name = "available_hours", length = 200)
    private String availableHours;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 