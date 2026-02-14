package com.nigga.medivaultsb.repository;

import com.nigga.medivaultsb.model.MedicalRecord;
import com.nigga.medivaultsb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientOrderByUploadedAtDesc(User patient);
} 