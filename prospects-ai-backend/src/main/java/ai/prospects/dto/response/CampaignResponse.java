package ai.prospects.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CampaignResponse {
    private UUID id;
    private String name;
    private String description;
    private String status;
    private Integer totalEnrolled;
    private Integer totalConnected;
    private Integer totalReplied;
    private UUID linkedInAccountId;
    private String linkedInAccountName;
    private List<CampaignStepResponse> steps;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
