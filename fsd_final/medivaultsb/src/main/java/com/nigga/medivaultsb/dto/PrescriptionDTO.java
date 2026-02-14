package com.nigga.medivaultsb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDTO {
    private Long id;
    private UserDTO doctor;
    private String medication;
    private String dosage;
    private String instructions;
    private LocalDateTime prescribedAt;
} 