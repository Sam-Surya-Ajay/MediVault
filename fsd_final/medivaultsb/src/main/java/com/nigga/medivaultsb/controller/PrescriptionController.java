package com.nigga.medivaultsb.controller;

import com.nigga.medivaultsb.dto.PrescriptionDTO;
import com.nigga.medivaultsb.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;
    
    @GetMapping("/patient")
    public ResponseEntity<List<PrescriptionDTO>> getPatientPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getPatientPrescriptions());
    }
    
    @GetMapping("/doctor")
    public ResponseEntity<List<PrescriptionDTO>> getDoctorPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getDoctorPrescriptions());
    }
    
    @PostMapping
    public ResponseEntity<PrescriptionDTO> addPrescription(@RequestBody Map<String, Object> payload) {
        Object patientIdObj = payload.get("patientId");
        if (patientIdObj == null) {
            throw new IllegalArgumentException("patientId is required");
        }
        Long patientId = Long.parseLong(patientIdObj.toString());
        String medication = (String) payload.get("medication");
        String dosage = (String) payload.get("dosage");
        String instructions = (String) payload.get("instructions");
        
        PrescriptionDTO prescription = prescriptionService.addPrescription(
                patientId, medication, dosage, instructions);
                
        return ResponseEntity.status(HttpStatus.CREATED).body(prescription);
    }
} 