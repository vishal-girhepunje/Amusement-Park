package com.adventurelandVillage.service;

import com.adventurelandVillage.exception.LoginException;

public interface OtpService {
	String generateOtp();
	void sendOtpToEmail(String email, String otp, String userType) throws LoginException;
	void sendOtpToMobile(String mobileNumber, String otp, String userType) throws LoginException;
	boolean verifyOtp(String email, String mobileNumber, String otpCode, String userType) throws LoginException;
	void invalidateOtp(String email, String mobileNumber, String userType);
}

