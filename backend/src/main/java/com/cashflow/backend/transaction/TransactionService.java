package com.cashflow.backend.transaction;

import java.time.LocalDate;
import java.util.UUID;

import com.cashflow.backend.common.PageResponse;
import com.cashflow.backend.common.exception.ResourceNotFoundException;
import com.cashflow.backend.transaction.dto.TransactionRequest;
import com.cashflow.backend.transaction.dto.TransactionResponse;
import com.cashflow.backend.transaction.dto.TransactionUpdateRequest;
import com.cashflow.backend.user.User;
import com.cashflow.backend.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
	private final TransactionRepository transactionRepository;
	private final UserRepository userRepository;

	public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
		this.transactionRepository = transactionRepository;
		this.userRepository = userRepository;
	}

	public PageResponse<TransactionResponse> list(UUID userId,
			String search,
			TransactionType type,
			String category,
			LocalDate from,
			LocalDate to,
			Boolean recurring,
			int page,
			int size) {
		Specification<Transaction> spec = Specification
				.where(TransactionSpecifications.hasUserId(userId))
				.and(TransactionSpecifications.matchesSearch(search))
				.and(TransactionSpecifications.hasType(type))
				.and(TransactionSpecifications.hasCategory(category))
				.and(TransactionSpecifications.betweenDates(from, to))
				.and(TransactionSpecifications.isRecurring(recurring));

		PageRequest pageable = PageRequest.of(
				page,
				size,
				Sort.by(Sort.Direction.DESC, "date", "createdAt")
		);

		Page<TransactionResponse> result = transactionRepository.findAll(spec, pageable)
				.map(TransactionResponse::from);

		return PageResponse.from(result);
	}

	public TransactionResponse create(UUID userId, TransactionRequest request) {
		User user = userRepository.getReferenceById(userId);
		Transaction transaction = new Transaction();
		transaction.setUser(user);
		applyRequest(transaction, request);
		Transaction saved = transactionRepository.save(transaction);
		return TransactionResponse.from(saved);
	}

	public TransactionResponse update(UUID userId, UUID transactionId, TransactionUpdateRequest request) {
		Transaction transaction = transactionRepository.findByIdAndUser_Id(transactionId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
		applyRequest(transaction, request);
		Transaction saved = transactionRepository.save(transaction);
		return TransactionResponse.from(saved);
	}

	public void delete(UUID userId, UUID transactionId) {
		Transaction transaction = transactionRepository.findByIdAndUser_Id(transactionId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
		transactionRepository.delete(transaction);
	}

	private void applyRequest(Transaction transaction, TransactionRequest request) {
		transaction.setTitle(request.title());
		transaction.setAmount(request.amount());
		transaction.setType(request.type());
		transaction.setCategory(request.category());
		transaction.setNote(request.note());
		transaction.setDate(request.date());
		transaction.setRecurring(request.recurring());
	}

	private void applyRequest(Transaction transaction, TransactionUpdateRequest request) {
		transaction.setTitle(request.title());
		transaction.setAmount(request.amount());
		transaction.setType(request.type());
		transaction.setCategory(request.category());
		transaction.setNote(request.note());
		transaction.setDate(request.date());
		transaction.setRecurring(request.recurring());
	}
}
