package ai.prospects.controller;

import ai.prospects.dto.request.LeadRequest;
import ai.prospects.dto.response.ApiResponse;
import ai.prospects.dto.response.LeadResponse;
import ai.prospects.security.UserPrincipal;
import ai.prospects.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LeadResponse>>> getLeads(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) UUID leadListId) {
        Page<LeadResponse> leads = service.getLeads(principal, page, size, status, source, company, industry, leadListId);
        return ResponseEntity.ok(ApiResponse.ok(leads));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponse>> getLead(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.getLead(id, principal)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeadResponse>> createLead(
            @RequestBody LeadRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(service.createLead(request, principal)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadResponse>> updateLead(
            @PathVariable UUID id,
            @RequestBody LeadRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateLead(id, request, principal)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        service.deleteLead(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(null, "Lead deleted"));
    }
}
