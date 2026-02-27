package ai.prospects.entity;

import ai.prospects.enums.StepType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campaign_steps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignStep extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "step_type", nullable = false)
    private StepType stepType;

    @Column(name = "message_template", columnDefinition = "TEXT")
    private String messageTemplate;

    @Column(name = "ai_personalize", nullable = false)
    @Builder.Default
    private Boolean aiPersonalize = false;

    @Column(name = "delay_days", nullable = false)
    @Builder.Default
    private Integer delayDays = 0;

    @Column(name = "delay_hours", nullable = false)
    @Builder.Default
    private Integer delayHours = 0;
}
