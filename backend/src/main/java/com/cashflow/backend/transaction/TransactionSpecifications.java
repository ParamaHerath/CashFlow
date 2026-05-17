package com.cashflow.backend.transaction;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class TransactionSpecifications {
	private TransactionSpecifications() {
	}

	public static Specification<Transaction> hasUserId(UUID userId) {
		return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
	}

	public static Specification<Transaction> hasType(TransactionType type) {
		return (root, query, cb) -> type == null ? cb.conjunction()
				: cb.equal(root.get("type"), type);
	}

	public static Specification<Transaction> hasCategory(String category) {
		if (!StringUtils.hasText(category)) {
			return (root, query, cb) -> cb.conjunction();
		}
		String pattern = "%" + category.trim().toLowerCase() + "%";
		return (root, query, cb) -> cb.like(cb.lower(root.get("category")), pattern);
	}

	public static Specification<Transaction> matchesSearch(String search) {
		if (!StringUtils.hasText(search)) {
			return (root, query, cb) -> cb.conjunction();
		}
		String pattern = "%" + search.trim().toLowerCase() + "%";
		return (root, query, cb) -> cb.or(
				cb.like(cb.lower(root.get("title")), pattern),
				cb.like(cb.lower(root.get("note")), pattern)
		);
	}

	public static Specification<Transaction> betweenDates(LocalDate from, LocalDate to) {
		return (root, query, cb) -> {
			if (from == null && to == null) {
				return cb.conjunction();
			}
			if (from != null && to != null) {
				return cb.between(root.get("date"), from, to);
			}
			if (from != null) {
				return cb.greaterThanOrEqualTo(root.get("date"), from);
			}
			return cb.lessThanOrEqualTo(root.get("date"), to);
		};
	}

	public static Specification<Transaction> isRecurring(Boolean recurring) {
		return (root, query, cb) -> recurring == null ? cb.conjunction()
				: cb.equal(root.get("recurring"), recurring);
	}
}
