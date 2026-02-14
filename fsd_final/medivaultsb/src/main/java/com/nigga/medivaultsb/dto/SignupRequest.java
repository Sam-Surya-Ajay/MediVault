package com.nigga.medivaultsb.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    private String phone;
    
    @NotBlank(message = "Role is required")
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
    
    // Patient-specific fields
    private PatientDetailsDTO patientDetails;
} 