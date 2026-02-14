package com.nigga.medivaultsb.controller;

import com.nigga.medivaultsb.dto.AppointmentDTO;
import com.nigga.medivaultsb.dto.UserDTO;
import com.nigga.medivaultsb.service.AppointmentService;
import com.nigga.medivaultsb.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    
    @GetMapping("/patient")
    public ResponseEntity<List<AppointmentDTO>> getPatientAppointments() {
        return ResponseEntity.ok(appointmentService.getPatientAppointments());
    }
    
    @GetMapping("/patient/upcoming")
    public ResponseEntity<List<AppointmentDTO>> getPatientUpcomingAppointments() {
        return ResponseEntity.ok(appointmentService.getPatientUpcomingAppointments());
    }
    
    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentDTO>> getDoctorAppointments() {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments());
    }
    
    @GetMapping("/doctor/upcoming")
    public ResponseEntity<List<AppointmentDTO>> getDoctorUpcomingAppointments() {
        return ResponseEntity.ok(appointmentService.getDoctorUpcomingAppointments());
    }
    
    @GetMapping("/doctors")
    public ResponseEntity<List<UserDTO>> getAllDoctors() {
        return ResponseEntity.ok(appointmentService.getAllDoctors());
    }
    
    @PostMapping("/schedule")
    public ResponseEntity<AppointmentDTO> scheduleAppointment(@RequestBody Map<String, Object> payload) {
        Long doctorId = Long.parseLong(payload.get("doctorId").toString());
        LocalDateTime appointmentTime = LocalDateTime.parse(payload.get("appointmentTime").toString());
        
        AppointmentDTO appointment = appointmentService.scheduleAppointment(doctorId, appointmentTime);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        
        String status = (String) payload.get("status");
        String rejectionReason = (String) payload.get("rejectionReason");
        
        AppointmentDTO appointment = appointmentService.updateAppointmentStatus(id, status, rejectionReason);
        return ResponseEntity.ok(appointment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<UserDTO>> getAllPatientsForDoctor(@RequestParam Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAllPatientsForDoctor(doctorId));
    }
} 