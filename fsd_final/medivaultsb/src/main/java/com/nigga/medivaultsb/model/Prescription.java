package com.nigga.medivaultsb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private User patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private User doctor;
    
    @Column(name = "medication", nullable = false)
    private String medication;
    
    @Column(name = "dosage", nullable = false)
    private String dosage;
    
    @Column(name = "instructions")
    private String instructions;
    
    @Column(name = "prescribed_at", nullable = false)
    private LocalDateTime prescribedAt;
    
    @PrePersist
    protected void onCreate() {
        prescribedAt = LocalDateTime.now();
    }
} 