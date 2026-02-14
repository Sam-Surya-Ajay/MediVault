package com.nigga.medivaultsb.controller;

import com.nigga.medivaultsb.dto.MedicalRecordDTO;
import com.nigga.medivaultsb.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;
    
    @GetMapping
    public ResponseEntity<List<MedicalRecordDTO>> getMedicalRecords() {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecords());
    }
    
    @PostMapping
    public ResponseEntity<MedicalRecordDTO> addMedicalRecord(
            @RequestParam("title") String title,
            @RequestParam("doctorName") String doctorName,
            @RequestParam("recordType") String recordType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("file") MultipartFile file) {
        
        try {
            MedicalRecordDTO savedRecord = medicalRecordService.addMedicalRecord(
                    title, doctorName, recordType, description, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        byte[] fileData = medicalRecordService.getMedicalRecordFile(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "record_" + id + ".pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(fileData);
    }
} 