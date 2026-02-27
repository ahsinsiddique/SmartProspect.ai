package ai.prospects.controller;

import ai.prospects.dto.request.ProxyRequest;
import ai.prospects.dto.response.ApiResponse;
import ai.prospects.dto.response.ProxyResponse;
import ai.prospects.security.UserPrincipal;
import ai.prospects.service.ProxyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/proxies")
@RequiredArgsConstructor
public class ProxyController {

    private final ProxyService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProxyResponse>>> getProxies(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(service.getProxies(principal)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProxyResponse>> createProxy(
            @Valid @RequestBody ProxyRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(service.createProxy(request, principal)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProxy(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        service.deleteProxy(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(null, "Proxy deleted"));
    }
}
