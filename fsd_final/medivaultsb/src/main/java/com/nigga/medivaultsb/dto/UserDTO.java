package com.nigga.medivaultsb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String gender;
    private Integer age;
    
    // Doctor-specific fields
    private String specialty;
    private String licenseNumber;
    private Integer yearsOfExperience;
    private String bio;
    private String clinicName;
    private String clinicLocation;
    private String availableHours;
} 