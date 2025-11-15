package com.adventurelandVillage.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adventurelandVillage.model.Otp;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
	Optional<Otp> findByEmailAndOtpCodeAndIsUsedFalse(String email, String otpCode);
	Optional<Otp> findByMobileNumberAndOtpCodeAndIsUsedFalse(String mobileNumber, String otpCode);
	Optional<Otp> findByEmailAndIsUsedFalse(String email);
	Optional<Otp> findByMobileNumberAndIsUsedFalse(String mobileNumber);
}

