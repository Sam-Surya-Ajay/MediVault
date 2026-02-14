package com.nigga.medivaultsb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDetailsDTO {
    private String insuranceProvider;
    private String insuranceNumber;
    private String emergencyContactName;
    private String emergencyContactPhone;
} 