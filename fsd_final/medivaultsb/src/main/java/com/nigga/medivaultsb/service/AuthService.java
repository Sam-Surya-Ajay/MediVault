package com.nigga.medivaultsb.service;

import com.nigga.medivaultsb.dto.AuthResponse;
import com.nigga.medivaultsb.dto.LoginRequest;
import com.nigga.medivaultsb.dto.PatientDetailsDTO;
import com.nigga.medivaultsb.dto.SignupRequest;
import com.nigga.medivaultsb.model.PatientDetails;
import com.nigga.medivaultsb.model.User;
import com.nigga.medivaultsb.repository.PatientDetailsRepository;
import com.nigga.medivaultsb.repository.UserRepository;
import com.nigga.medivaultsb.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PatientDetailsRepository patientDetailsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setGender(request.getGender());
        user.setAge(request.getAge());
        
        // Set doctor-specific fields if applicable
        if ("DOCTOR".equalsIgnoreCase(request.getRole())) {
            user.setSpecialty(request.getSpecialty());
            user.setLicenseNumber(request.getLicenseNumber());
            user.setYearsOfExperience(request.getYearsOfExperience());
            user.setBio(request.getBio());
            user.setClinicName(request.getClinicName());
            user.setClinicLocation(request.getClinicLocation());
            user.setAvailableHours(request.getAvailableHours());
        }
        
        User savedUser = userRepository.save(user);
        
        // Save patient details if applicable
        if ("PATIENT".equalsIgnoreCase(request.getRole()) && request.getPatientDetails() != null) {
            PatientDetailsDTO patientDetailsDTO = request.getPatientDetails();
            
            PatientDetails patientDetails = new PatientDetails();
            patientDetails.setUser(savedUser);
            patientDetails.setInsuranceProvider(patientDetailsDTO.getInsuranceProvider());
            patientDetails.setInsuranceNumber(patientDetailsDTO.getInsuranceNumber());
            patientDetails.setEmergencyContactName(patientDetailsDTO.getEmergencyContactName());
            patientDetails.setEmergencyContactPhone(patientDetailsDTO.getEmergencyContactPhone());
            
            patientDetailsRepository.save(patientDetails);
        }
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", savedUser.getRole());
        
        String token = jwtUtil.generateToken(
            org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getEmail())
                .password(savedUser.getPasswordHash())
                .authorities("ROLE_" + savedUser.getRole().toUpperCase())
                .build(),
            claims
        );
        
        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        if (authentication.isAuthenticated()) {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", user.getRole());
            
            String token = jwtUtil.generateToken(
                org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPasswordHash())
                    .authorities("ROLE_" + user.getRole().toUpperCase())
                    .build(),
                claims
            );
            
            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
        }
        
        throw new RuntimeException("Authentication failed");
    }
} 