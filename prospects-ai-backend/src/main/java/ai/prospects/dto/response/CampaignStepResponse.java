package ai.prospects.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CampaignStepResponse {
    private UUID id;
    private Integer stepOrder;
    private String stepType;
    private String messageTemplate;
    private Boolean aiPersonalize;
    private Integer delayDays;
    private Integer delayHours;
}
