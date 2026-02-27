package ai.prospects.controller;

import ai.prospects.dto.request.LinkedInAccountRequest;
import ai.prospects.dto.response.ApiResponse;
import ai.prospects.dto.response.LinkedInAccountResponse;
import ai.prospects.security.UserPrincipal;
import ai.prospects.service.LinkedInAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/linkedin-accounts")
@RequiredArgsConstructor
public class LinkedInAccountController {

    private final LinkedInAccountService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LinkedInAccountResponse>>> getAccounts(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAccounts(principal)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LinkedInAccountResponse>> getAccount(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAccount(id, principal)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LinkedInAccountResponse>> createAccount(
            @Valid @RequestBody LinkedInAccountRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(service.createAccount(request, principal)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LinkedInAccountResponse>> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody LinkedInAccountRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateAccount(id, request, principal)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        service.deleteAccount(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(null, "Account deleted"));
    }

    @PostMapping("/{id}/connect")
    public ResponseEntity<ApiResponse<LinkedInAccountResponse>> connect(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.connect(id, principal)));
    }

    @PostMapping("/{id}/disconnect")
    public ResponseEntity<ApiResponse<LinkedInAccountResponse>> disconnect(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.disconnect(id, principal)));
    }
}
