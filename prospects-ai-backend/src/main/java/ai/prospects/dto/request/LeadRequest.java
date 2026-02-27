package ai.prospects.dto.request;

import lombok.Data;

import java.util.Map;
import java.util.UUID;

@Data
public class LeadRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String linkedinUrl;
    private String company;
    private String title;
    private String industry;
    private String location;
    private String summary;
    private String source;
    private UUID leadListId;
    private Map<String, Object> customFields;
}
