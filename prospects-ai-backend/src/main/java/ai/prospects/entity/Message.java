package ai.prospects.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private CampaignEnrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id")
    private CampaignStep step;

    @Column(name = "original_template", columnDefinition = "TEXT")
    private String originalTemplate;

    @Column(name = "personalized_content", columnDefinition = "TEXT")
    private String personalizedContent;

    @Column(name = "sent_at")
    private OffsetDateTime sentAt;

    @Column(name = "delivered_at")
    private OffsetDateTime deliveredAt;

    @Column(name = "replied_at")
    private OffsetDateTime repliedAt;

    @Column(name = "linkedin_message_id")
    private String linkedinMessageId;
}
