package com.nigga.medivaultsb.service;

import com.nigga.medivaultsb.dto.MedicalRecordDTO;
import com.nigga.medivaultsb.model.MedicalRecord;
import com.nigga.medivaultsb.model.User;
import com.nigga.medivaultsb.repository.MedicalRecordRepository;
import com.nigga.medivaultsb.repository.UserRepository;
import com.nigga.medivaultsb.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<MedicalRecordDTO> getMedicalRecords() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return medicalRecordRepository.findByPatientOrderByUploadedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public MedicalRecordDTO addMedicalRecord(String title, String doctorName, 
                                          String recordType, String description,
                                          MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setPatient(patient);
        medicalRecord.setTitle(title);
        medicalRecord.setDoctorName(doctorName);
        medicalRecord.setRecordType(recordType);
        medicalRecord.setDescription(description);
        medicalRecord.setFileName(file.getOriginalFilename());
        medicalRecord.setContentType(file.getContentType());
        
        // Use our utility class to safely convert the file to byte array
        byte[] fileBytes = FileUtil.convertToByteArray(file);
        medicalRecord.setFileData(fileBytes);
        
        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);
        return convertToDTO(savedRecord);
    }
    
    public byte[] getMedicalRecordFile(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        
        if (!record.getPatient().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to medical record");
        }
        
        return record.getFileData();
    }
    
    private MedicalRecordDTO convertToDTO(MedicalRecord record) {
        return new MedicalRecordDTO(
                record.getId(),
                record.getTitle(),
                record.getDoctorName(),
                record.getRecordType(),
                record.getDescription(),
                record.getFileName(),
                record.getUploadedAt()
        );
    }
} 