package ai.prospects.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LinkedInAccountResponse {
    private UUID id;
    private String linkedinEmail;
    private String memberId;
    private String fullName;
    private String headline;
    private String profilePictureUrl;
    private String status;
    private Integer dailyConnectionLimit;
    private Integer dailyMessageLimit;
    private Integer connectionsSentToday;
    private Integer messagesSentToday;
    private UUID proxyId;
    private String proxyLabel;
    private OffsetDateTime lastSyncedAt;
    private OffsetDateTime createdAt;
}
