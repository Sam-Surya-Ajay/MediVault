package com.nigga.medivaultsb.service;

import com.nigga.medivaultsb.dto.AppointmentDTO;
import com.nigga.medivaultsb.dto.UserDTO;
import com.nigga.medivaultsb.model.Appointment;
import com.nigga.medivaultsb.model.User;
import com.nigga.medivaultsb.repository.AppointmentRepository;
import com.nigga.medivaultsb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.nigga.medivaultsb.service.EmailService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public List<AppointmentDTO> getPatientAppointments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return appointmentRepository.findByPatientOrderByAppointmentTimeAsc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getPatientUpcomingAppointments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return appointmentRepository.findByPatientAndAppointmentTimeGreaterThanEqualOrderByAppointmentTimeAsc(user, LocalDateTime.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getDoctorAppointments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return appointmentRepository.findByDoctorOrderByAppointmentTimeAsc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> getDoctorUpcomingAppointments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return appointmentRepository.findByDoctorAndAppointmentTimeGreaterThanEqualOrderByAppointmentTimeAsc(user, LocalDateTime.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getAllDoctors() {
        return userRepository.findByRole("DOCTOR")
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AppointmentDTO scheduleAppointment(Long doctorId, LocalDateTime appointmentTime) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (!doctor.getRole().equals("DOCTOR")) {
            throw new RuntimeException("Selected user is not a doctor");
        }
        
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setStatus("PENDING");
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToDTO(savedAppointment);
    }
    
    @Transactional
    public AppointmentDTO updateAppointmentStatus(Long appointmentId, String status, String rejectionReason) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User doctor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("Unauthorized to update this appointment");
        }
        
        appointment.setStatus(status);
        if (status.equals("REJECTED") && rejectionReason != null) {
            appointment.setRejectionReason(rejectionReason);
        }
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        // Send email notification to patient
        String patientEmail = appointment.getPatient().getEmail();
        String subject = "Appointment Status Update";
        String text;
        if (status.equals("APPROVED")) {
            text = "Dear " + appointment.getPatient().getName() + ",\n\nYour appointment with Dr. " + doctor.getName() + " on " + appointment.getAppointmentTime() + " has been APPROVED.";
        } else if (status.equals("REJECTED")) {
            text = "Dear " + appointment.getPatient().getName() + ",\n\nYour appointment with Dr. " + doctor.getName() + " on " + appointment.getAppointmentTime() + " has been REJECTED. Reason: " + rejectionReason;
        } else {
            text = "Dear " + appointment.getPatient().getName() + ",\n\nYour appointment status has been updated to: " + status + ".";
        }
        emailService.sendEmail(patientEmail, subject, text);
        return convertToDTO(updatedAppointment);
    }
    
    @Transactional
    public void deleteAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (!"REJECTED".equals(appointment.getStatus()) && !"FINISHED".equals(appointment.getStatus())) {
            throw new RuntimeException("Only rejected or finished appointments can be deleted");
        }
        appointmentRepository.deleteById(appointmentId);
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
    
    private AppointmentDTO convertToDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                convertToUserDTO(appointment.getDoctor()),
                convertToUserDTO(appointment.getPatient()),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getRejectionReason(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt()
        );
    }

    public List<UserDTO> getAllPatientsForDoctor(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        List<Appointment> appointments = appointmentRepository.findByDoctorOrderByAppointmentTimeAsc(doctor);
        return appointments.stream()
                .map(Appointment::getPatient)
                .distinct()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    private UserDTO toUserDTO(User user) {
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