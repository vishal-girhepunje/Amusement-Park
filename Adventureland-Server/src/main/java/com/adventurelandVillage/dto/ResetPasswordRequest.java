package com.adventurelandVillage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
	private String email;
	private String mobileNumber;
	private String otpCode;
	private String newPassword;
	private String userType; // "CUSTOMER" or "ADMIN"
}

