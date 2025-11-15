package com.adventurelandVillage.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adventurelandVillage.exception.LoginException;
import com.adventurelandVillage.model.Otp;
import com.adventurelandVillage.repository.OtpRepository;

@Service
public class OtpServiceImpl implements OtpService {

	@Autowired
	private OtpRepository otpRepository;

	private static final int OTP_LENGTH = 6;
	private static final int OTP_EXPIRY_MINUTES = 10;

	@Override
	public String generateOtp() {
		Random random = new Random();
		StringBuilder otp = new StringBuilder();
		for (int i = 0; i < OTP_LENGTH; i++) {
			otp.append(random.nextInt(10));
		}
		return otp.toString();
	}

	@Override
	public void sendOtpToEmail(String email, String otp, String userType) throws LoginException {
		// Invalidate any existing OTP for this email
		invalidateOtp(email, null, userType);

		// Create new OTP
		Otp otpEntity = new Otp();
		otpEntity.setEmail(email);
		otpEntity.setOtpCode(otp);
		otpEntity.setCreatedAt(LocalDateTime.now());
		otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
		otpEntity.setIsUsed(false);
		otpEntity.setUserType(userType);

		otpRepository.save(otpEntity);

		// For now, we'll log the OTP to console
		// In production, you would send an email here using JavaMailSender or similar
		System.out.println("==========================================");
		System.out.println("OTP for " + email + " (" + userType + "): " + otp);
		System.out.println("This OTP will expire in " + OTP_EXPIRY_MINUTES + " minutes");
		System.out.println("==========================================");
		
		// TODO: Implement actual email sending
		// You can use Spring Mail or any email service like SendGrid, AWS SES, etc.
	}

	@Override
	public void sendOtpToMobile(String mobileNumber, String otp, String userType) throws LoginException {
		// Invalidate any existing OTP for this mobile number
		invalidateOtp(null, mobileNumber, userType);

		// Create new OTP
		Otp otpEntity = new Otp();
		otpEntity.setMobileNumber(mobileNumber);
		otpEntity.setOtpCode(otp);
		otpEntity.setCreatedAt(LocalDateTime.now());
		otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
		otpEntity.setIsUsed(false);
		otpEntity.setUserType(userType);

		otpRepository.save(otpEntity);

		// For now, we'll log the OTP to console
		// In production, you would send SMS here using Twilio, AWS SNS, or similar
		System.out.println("==========================================");
		System.out.println("OTP for " + mobileNumber + " (" + userType + "): " + otp);
		System.out.println("This OTP will expire in " + OTP_EXPIRY_MINUTES + " minutes");
		System.out.println("==========================================");
		
		// TODO: Implement actual SMS sending
		// You can use Twilio, AWS SNS, or any SMS gateway service
	}

	@Override
	public boolean verifyOtp(String email, String mobileNumber, String otpCode, String userType)
			throws LoginException {
		Optional<Otp> otpOptional;

		if (email != null && !email.isEmpty()) {
			otpOptional = otpRepository.findByEmailAndOtpCodeAndIsUsedFalse(email, otpCode);
		} else if (mobileNumber != null && !mobileNumber.isEmpty()) {
			otpOptional = otpRepository.findByMobileNumberAndOtpCodeAndIsUsedFalse(mobileNumber, otpCode);
		} else {
			throw new LoginException("Either email or mobile number must be provided");
		}

		if (otpOptional.isEmpty()) {
			throw new LoginException("Invalid OTP");
		}

		Otp otp = otpOptional.get();

		// Check if OTP matches user type
		if (!otp.getUserType().equals(userType)) {
			throw new LoginException("Invalid OTP for this user type");
		}

		// Check if OTP is expired
		if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
			throw new LoginException("OTP has expired. Please request a new one.");
		}

		// Mark OTP as used
		otp.setIsUsed(true);
		otpRepository.save(otp);

		return true;
	}

	@Override
	public void invalidateOtp(String email, String mobileNumber, String userType) {
		Optional<Otp> existingOtp;

		if (email != null && !email.isEmpty()) {
			existingOtp = otpRepository.findByEmailAndIsUsedFalse(email);
		} else if (mobileNumber != null && !mobileNumber.isEmpty()) {
			existingOtp = otpRepository.findByMobileNumberAndIsUsedFalse(mobileNumber);
		} else {
			return;
		}

		if (existingOtp.isPresent()) {
			Otp otp = existingOtp.get();
			if (otp.getUserType().equals(userType)) {
				otp.setIsUsed(true);
				otpRepository.save(otp);
			}
		}
	}
}

