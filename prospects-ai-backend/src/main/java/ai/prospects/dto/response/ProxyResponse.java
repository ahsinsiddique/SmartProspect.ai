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
public class ProxyResponse {
    private UUID id;
    private String label;
    private String host;
    private Integer port;
    private String username;
    private String proxyType;
    private Boolean isActive;
    private OffsetDateTime createdAt;
}
