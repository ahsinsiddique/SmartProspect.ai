package ai.prospects.entity;

import ai.prospects.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "linkedin_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LinkedInAccount extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proxy_id")
    private Proxy proxy;

    @Column(name = "linkedin_email", nullable = false)
    private String linkedinEmail;

    @Column(name = "li_at_cookie", columnDefinition = "TEXT")
    private String liAtCookie;

    @Column(name = "csrf_token", columnDefinition = "TEXT")
    private String csrfToken;

    @Column(name = "member_id")
    private String memberId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "headline", columnDefinition = "TEXT")
    private String headline;

    @Column(name = "profile_picture_url", columnDefinition = "TEXT")
    private String profilePictureUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AccountStatus status = AccountStatus.DISCONNECTED;

    @Column(name = "daily_connection_limit", nullable = false)
    @Builder.Default
    private Integer dailyConnectionLimit = 20;

    @Column(name = "daily_message_limit", nullable = false)
    @Builder.Default
    private Integer dailyMessageLimit = 50;

    @Column(name = "connections_sent_today", nullable = false)
    @Builder.Default
    private Integer connectionsSentToday = 0;

    @Column(name = "messages_sent_today", nullable = false)
    @Builder.Default
    private Integer messagesSentToday = 0;

    @Column(name = "last_synced_at")
    private OffsetDateTime lastSyncedAt;
}
