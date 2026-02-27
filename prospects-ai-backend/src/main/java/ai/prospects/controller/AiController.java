package ai.prospects.controller;

import ai.prospects.dto.request.AiPersonalizeRequest;
import ai.prospects.dto.response.ApiResponse;
import ai.prospects.security.UserPrincipal;
import ai.prospects.service.OpenAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final OpenAiService openAiService;

    @PostMapping("/personalize")
    public ResponseEntity<ApiResponse<Map<String, String>>> personalizeMessage(
            @Valid @RequestBody AiPersonalizeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String personalized = openAiService.personalizeMessage(
            request.getTemplate(), request.getLeadId(), request.getTone(), principal
        );
        return ResponseEntity.ok(ApiResponse.ok(Map.of("personalizedMessage", personalized)));
    }
}
