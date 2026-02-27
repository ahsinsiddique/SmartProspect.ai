package ai.prospects.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeadResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String linkedinUrl;
    private String linkedinProfileId;
    private String company;
    private String title;
    private String industry;
    private String location;
    private String summary;
    private String status;
    private String source;
    private UUID leadListId;
    private String leadListName;
    private Map<String, Object> customFields;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
