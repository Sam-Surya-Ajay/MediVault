package com.nigga.medivaultsb.repository;

import com.nigga.medivaultsb.model.PatientDetails;
import com.nigga.medivaultsb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientDetailsRepository extends JpaRepository<PatientDetails, Long> {
    Optional<PatientDetails> findByUser(User user);
} 