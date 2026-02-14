package com.nigga.medivaultsb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private User patient;
    
    @Column(name = "title", length = 255)
    private String title;
    
    @Column(name = "doctor_name", length = 255)
    private String doctorName;
    
    @Column(name = "record_type", length = 100)
    private String recordType;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;
    
    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;
    
    @Lob
    @Column(name = "file_data", nullable = false, columnDefinition = "bytea")
    private byte[] fileData;
    
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
    
    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
} 