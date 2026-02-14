package com.nigga.medivaultsb.service;

import com.nigga.medivaultsb.dto.UserDTO;
import com.nigga.medivaultsb.model.User;
import com.nigga.medivaultsb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    public UserDTO getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return convertToDTO(user);
    }
    
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getGender(),
                user.getAge(),
                user.getSpecialty(),
                user.getLicenseNumber(),
                user.getYearsOfExperience(),
                user.getBio(),
                user.getClinicName(),
                user.getClinicLocation(),
                user.getAvailableHours()
        );
    }
} 