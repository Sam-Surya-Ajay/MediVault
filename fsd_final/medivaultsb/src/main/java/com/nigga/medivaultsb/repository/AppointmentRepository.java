package com.nigga.medivaultsb.repository;

import com.nigga.medivaultsb.model.Appointment;
import com.nigga.medivaultsb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentTimeAsc(User patient);
    List<Appointment> findByDoctorOrderByAppointmentTimeAsc(User doctor);
    List<Appointment> findByPatientAndAppointmentTimeGreaterThanEqualOrderByAppointmentTimeAsc(User patient, LocalDateTime now);
    List<Appointment> findByDoctorAndAppointmentTimeGreaterThanEqualOrderByAppointmentTimeAsc(User doctor, LocalDateTime now);
} 