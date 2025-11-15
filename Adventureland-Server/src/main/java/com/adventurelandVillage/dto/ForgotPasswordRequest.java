package com.adventurelandVillage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordRequest {
	private String email;
	private String mobileNumber;
	private String userType; // "CUSTOMER" or "ADMIN"
}

