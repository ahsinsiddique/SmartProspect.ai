package ai.prospects.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AiPersonalizeRequest {

    @NotBlank(message = "Template is required")
    private String template;

    @NotNull(message = "Lead ID is required")
    private UUID leadId;

    private String tone = "professional";
}
