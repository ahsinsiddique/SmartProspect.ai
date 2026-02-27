package ai.prospects.controller;

import ai.prospects.dto.request.CampaignRequest;
import ai.prospects.dto.request.CampaignStepRequest;
import ai.prospects.dto.response.ApiResponse;
import ai.prospects.dto.response.CampaignResponse;
import ai.prospects.dto.response.CampaignStepResponse;
import ai.prospects.security.UserPrincipal;
import ai.prospects.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CampaignResponse>>> getCampaigns(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(service.getCampaigns(principal, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> getCampaign(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.getCampaign(id, principal)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampaignResponse>> createCampaign(
            @Valid @RequestBody CampaignRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(service.createCampaign(request, principal)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> updateCampaign(
            @PathVariable UUID id,
            @Valid @RequestBody CampaignRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateCampaign(id, request, principal)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        service.deleteCampaign(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(null, "Campaign deleted"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CampaignResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.ok(service.updateStatus(id, status, principal)));
    }

    @PostMapping("/{id}/steps")
    public ResponseEntity<ApiResponse<CampaignStepResponse>> addStep(
            @PathVariable UUID id,
            @Valid @RequestBody CampaignStepRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(service.addStep(id, request, principal)));
    }

    @PutMapping("/{id}/steps/{stepId}")
    public ResponseEntity<ApiResponse<CampaignStepResponse>> updateStep(
            @PathVariable UUID id,
            @PathVariable UUID stepId,
            @Valid @RequestBody CampaignStepRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.updateStep(id, stepId, request, principal)));
    }

    @DeleteMapping("/{id}/steps/{stepId}")
    public ResponseEntity<ApiResponse<Void>> deleteStep(
            @PathVariable UUID id,
            @PathVariable UUID stepId,
            @AuthenticationPrincipal UserPrincipal principal) {
        service.deleteStep(id, stepId, principal);
        return ResponseEntity.ok(ApiResponse.ok(null, "Step deleted"));
    }

    @PostMapping("/{id}/enroll/{leadId}")
    public ResponseEntity<ApiResponse<Void>> enrollLead(
            @PathVariable UUID id,
            @PathVariable UUID leadId,
            @AuthenticationPrincipal UserPrincipal principal) {
        service.enrollLead(id, leadId, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(null, "Lead enrolled in campaign"));
    }
}
