package com.nigga.medivaultsb.repository;

import com.nigga.medivaultsb.model.Prescription;
import com.nigga.medivaultsb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientOrderByPrescribedAtDesc(User patient);
    List<Prescription> findByDoctorOrderByPrescribedAtDesc(User doctor);
} 