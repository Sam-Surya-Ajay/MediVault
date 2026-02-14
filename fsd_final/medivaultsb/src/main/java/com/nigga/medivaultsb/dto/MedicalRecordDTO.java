package com.nigga.medivaultsb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordDTO {
    private Long id;
    private String title;
    private String doctorName;
    private String recordType;
    private String description;
    private String fileName;
    private LocalDateTime uploadedAt;
} 