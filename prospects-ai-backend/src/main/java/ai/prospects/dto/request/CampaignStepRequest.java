package ai.prospects.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CampaignStepRequest {

    @NotNull(message = "Step type is required")
    private String stepType;

    private String messageTemplate;
    private Boolean aiPersonalize = false;
    private Integer delayDays = 0;
    private Integer delayHours = 0;
    private Integer stepOrder;
}
