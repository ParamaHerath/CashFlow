package com.cashflow.backend.transaction;

import java.time.LocalDate;
import java.util.UUID;

import com.cashflow.backend.common.ApiResponse;
import com.cashflow.backend.common.PageResponse;
import com.cashflow.backend.common.exception.UnauthorizedException;
import com.cashflow.backend.security.UserPrincipal;
import com.cashflow.backend.transaction.dto.TransactionRequest;
import com.cashflow.backend.transaction.dto.TransactionResponse;
import com.cashflow.backend.transaction.dto.TransactionUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
	private final TransactionService transactionService;

	public TransactionController(TransactionService transactionService) {
		this.transactionService = transactionService;
	}

	@GetMapping
	public PageResponse<TransactionResponse> list(@AuthenticationPrincipal UserPrincipal principal,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) TransactionType type,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) Boolean recurring,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		UUID userId = requireUser(principal);
		return transactionService.list(userId, search, type, category, from, to, recurring, page, size);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public TransactionResponse create(@AuthenticationPrincipal UserPrincipal principal,
			@Valid @RequestBody TransactionRequest request) {
		UUID userId = requireUser(principal);
		return transactionService.create(userId, request);
	}

	@PutMapping("/{id}")
	public TransactionResponse update(@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID id,
			@Valid @RequestBody TransactionUpdateRequest request) {
		UUID userId = requireUser(principal);
		return transactionService.update(userId, id, request);
	}

	@DeleteMapping("/{id}")
	public ApiResponse delete(@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID id) {
		UUID userId = requireUser(principal);
		transactionService.delete(userId, id);
		return new ApiResponse("Transaction deleted");
	}

	private UUID requireUser(UserPrincipal principal) {
		if (principal == null) {
			throw new UnauthorizedException("Not authenticated");
		}
		return principal.getId();
	}
}
