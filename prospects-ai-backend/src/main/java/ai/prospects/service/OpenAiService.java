package ai.prospects.service;

import ai.prospects.entity.Lead;
import ai.prospects.exception.ResourceNotFoundException;
import ai.prospects.repository.LeadRepository;
import ai.prospects.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiService {

    private final LeadRepository leadRepository;
    private final WebClient openAiWebClient;

    public String personalizeMessage(String template, UUID leadId, String tone,
                                      UserPrincipal principal) {
        Lead lead = leadRepository.findByIdAndUserId(leadId, principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        String prompt = buildPrompt(template, lead, tone);
        return callOpenAi(prompt);
    }

    private String buildPrompt(String template, Lead lead, String tone) {
        return String.format("""
            You are an expert LinkedIn outreach copywriter. Personalize the following message template \
            for a specific prospect. Keep it concise (under 300 characters for connection requests, \
            under 500 for messages), %s in tone, and highly personalized based on their profile.

            Template:
            %s

            Prospect details:
            - Name: %s %s
            - Title: %s
            - Company: %s
            - Industry: %s
            - Location: %s
            - Summary: %s

            Return ONLY the personalized message text, no explanations.
            """,
            tone,
            template,
            lead.getFirstName() != null ? lead.getFirstName() : "",
            lead.getLastName() != null ? lead.getLastName() : "",
            lead.getTitle() != null ? lead.getTitle() : "professional",
            lead.getCompany() != null ? lead.getCompany() : "their company",
            lead.getIndustry() != null ? lead.getIndustry() : "their industry",
            lead.getLocation() != null ? lead.getLocation() : "",
            lead.getSummary() != null ? lead.getSummary().substring(0, Math.min(200, lead.getSummary().length())) : ""
        );
    }

    @SuppressWarnings("unchecked")
    private String callOpenAi(String prompt) {
        try {
            Map<String, Object> response = openAiWebClient.post()
                .uri("/chat/completions")
                .bodyValue(Map.of(
                    "model", "gpt-4o-mini",
                    "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                    ),
                    "max_tokens", 300,
                    "temperature", 0.7
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            log.error("OpenAI API call failed", e);
        }
        return "Could not generate personalized message. Please try again.";
    }
}
