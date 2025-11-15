package com.adventurelandVillage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.adventurelandVillage.dto.ForgotPasswordRequest;
import com.adventurelandVillage.dto.ResetPasswordRequest;
import com.adventurelandVillage.exception.CustomerException;
import com.adventurelandVillage.exception.LoginException;
import com.adventurelandVillage.model.Admin;
import com.adventurelandVillage.model.Customer;
import com.adventurelandVillage.repository.AdminRepo;
import com.adventurelandVillage.repository.CustomerRepository;
import com.adventurelandVillage.service.OtpService;

@RestController
public class PasswordResetController {

	@Autowired
	private OtpService otpService;

	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private AdminRepo adminRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request)
			throws LoginException, CustomerException {
		
		if ((request.getEmail() == null || request.getEmail().isEmpty()) 
				&& (request.getMobileNumber() == null || request.getMobileNumber().isEmpty())) {
			throw new LoginException("Either email or mobile number must be provided");
		}

		String otp = otpService.generateOtp();

		if (request.getEmail() != null && !request.getEmail().isEmpty()) {
			// Verify user exists
			if ("CUSTOMER".equals(request.getUserType())) {
				customerRepository.findByEmail(request.getEmail())
						.orElseThrow(() -> new CustomerException("Customer not found with this email"));
			} else if ("ADMIN".equals(request.getUserType())) {
				adminRepository.findByEmail(request.getEmail())
						.orElseThrow(() -> new CustomerException("Admin not found with this email"));
			}
			otpService.sendOtpToEmail(request.getEmail(), otp, request.getUserType());
		} else if (request.getMobileNumber() != null && !request.getMobileNumber().isEmpty()) {
			// Verify user exists
			if ("CUSTOMER".equals(request.getUserType())) {
				Customer customer = customerRepository.findByMobileNumber(request.getMobileNumber());
				if (customer == null) {
					throw new CustomerException("Customer not found with this mobile number");
				}
			} else if ("ADMIN".equals(request.getUserType())) {
				// Admin might not have mobile number, handle accordingly
				throw new CustomerException("Admin password reset via mobile number is not supported");
			}
			otpService.sendOtpToMobile(request.getMobileNumber(), otp, request.getUserType());
		}

		return new ResponseEntity<>("OTP has been sent to your registered email/mobile number", HttpStatus.OK);
	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request)
			throws LoginException, CustomerException {
		
		// Verify OTP
		otpService.verifyOtp(request.getEmail(), request.getMobileNumber(), request.getOtpCode(),
				request.getUserType());

		// Reset password
		if ("CUSTOMER".equals(request.getUserType())) {
			Customer customer;
			if (request.getEmail() != null && !request.getEmail().isEmpty()) {
				customer = customerRepository.findByEmail(request.getEmail())
						.orElseThrow(() -> new CustomerException("Customer not found"));
			} else {
				customer = customerRepository.findByMobileNumber(request.getMobileNumber());
				if (customer == null) {
					throw new CustomerException("Customer not found");
				}
			}
			customer.setPassword(passwordEncoder.encode(request.getNewPassword()));
			customerRepository.save(customer);
		} else if ("ADMIN".equals(request.getUserType())) {
			if (request.getEmail() == null || request.getEmail().isEmpty()) {
				throw new CustomerException("Email is required for admin password reset");
			}
			Admin admin = adminRepository.findByEmail(request.getEmail())
					.orElseThrow(() -> new CustomerException("Admin not found"));
			admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
			adminRepository.save(admin);
		}

		return new ResponseEntity<>("Password has been reset successfully", HttpStatus.OK);
	}
}

