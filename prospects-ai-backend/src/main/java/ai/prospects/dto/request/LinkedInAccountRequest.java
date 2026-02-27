package ai.prospects.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class LinkedInAccountRequest {

    @NotBlank(message = "LinkedIn email is required")
    @Email(message = "Invalid email format")
    private String linkedinEmail;

    @NotBlank(message = "li_at cookie is required")
    private String liAtCookie;

    private String csrfToken;
    private UUID proxyId;
    private Integer dailyConnectionLimit;
    private Integer dailyMessageLimit;
}
