package com.nigga.medivaultsb.service;

import com.nigga.medivaultsb.dto.PrescriptionDTO;
import com.nigga.medivaultsb.dto.UserDTO;
import com.nigga.medivaultsb.model.Prescription;
import com.nigga.medivaultsb.model.User;
import com.nigga.medivaultsb.repository.PrescriptionRepository;
import com.nigga.medivaultsb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<PrescriptionDTO> getPatientPrescriptions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return prescriptionRepository.findByPatientOrderByPrescribedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PrescriptionDTO> getDoctorPrescriptions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return prescriptionRepository.findByDoctorOrderByPrescribedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public PrescriptionDTO addPrescription(Long patientId, String medication, 
                                         String dosage, String instructions) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User doctor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setMedication(medication);
        prescription.setDosage(dosage);
        prescription.setInstructions(instructions);
        
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return convertToDTO(savedPrescription);
    }
    
    private UserDTO convertToUserDTO(User user) {
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
    
    private PrescriptionDTO convertToDTO(Prescription prescription) {
        return new PrescriptionDTO(
                prescription.getId(),
                convertToUserDTO(prescription.getDoctor()),
                prescription.getMedication(),
                prescription.getDosage(),
                prescription.getInstructions(),
                prescription.getPrescribedAt()
        );
    }
} 