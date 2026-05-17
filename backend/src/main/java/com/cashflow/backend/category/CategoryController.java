package com.cashflow.backend.category;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.cashflow.backend.category.dto.CategoryRequest;
import com.cashflow.backend.category.dto.CategoryResponse;
import com.cashflow.backend.category.dto.CategoryUpdateRequest;
import com.cashflow.backend.common.ApiResponse;
import com.cashflow.backend.common.exception.UnauthorizedException;
import com.cashflow.backend.security.UserPrincipal;
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
@RequestMapping("/api/categories")
public class CategoryController {
	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping
	public List<CategoryResponse> list(@AuthenticationPrincipal UserPrincipal principal,
			@RequestParam(required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
		UUID userId = requireUser(principal);
		return categoryService.list(userId, from, to);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public CategoryResponse create(@AuthenticationPrincipal UserPrincipal principal,
			@Valid @RequestBody CategoryRequest request) {
		UUID userId = requireUser(principal);
		return categoryService.create(userId, request);
	}

	@PutMapping("/{id}")
	public CategoryResponse update(@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID id,
			@Valid @RequestBody CategoryUpdateRequest request) {
		UUID userId = requireUser(principal);
		return categoryService.update(userId, id, request);
	}

	@DeleteMapping("/{id}")
	public ApiResponse delete(@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID id) {
		UUID userId = requireUser(principal);
		categoryService.delete(userId, id);
		return new ApiResponse("Category deleted");
	}

	private UUID requireUser(UserPrincipal principal) {
		if (principal == null) {
			throw new UnauthorizedException("Not authenticated");
		}
		return principal.getId();
	}
}
