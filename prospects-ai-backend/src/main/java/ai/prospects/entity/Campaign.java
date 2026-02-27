package ai.prospects.entity;

import ai.prospects.enums.CampaignStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linkedin_account_id")
    private LinkedInAccount linkedInAccount;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Column(name = "total_enrolled", nullable = false)
    @Builder.Default
    private Integer totalEnrolled = 0;

    @Column(name = "total_connected", nullable = false)
    @Builder.Default
    private Integer totalConnected = 0;

    @Column(name = "total_replied", nullable = false)
    @Builder.Default
    private Integer totalReplied = 0;

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    @Builder.Default
    private List<CampaignStep> steps = new ArrayList<>();
}
