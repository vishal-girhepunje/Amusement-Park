package com.adventurelandVillage.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Otp {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long otpId;
	
	private String email;
	private String mobileNumber;
	private String otpCode;
	private LocalDateTime createdAt;
	private LocalDateTime expiresAt;
	private Boolean isUsed;
	private String userType; // "CUSTOMER" or "ADMIN"
}

