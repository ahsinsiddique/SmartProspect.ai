package ai.prospects.entity;

import ai.prospects.enums.ProxyType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proxies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proxy extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "label")
    private String label;

    @Column(name = "host", nullable = false)
    private String host;

    @Column(name = "port", nullable = false)
    private Integer port;

    @Column(name = "username")
    private String username;

    @Column(name = "password_enc")
    private String passwordEnc;

    @Enumerated(EnumType.STRING)
    @Column(name = "proxy_type", nullable = false)
    @Builder.Default
    private ProxyType proxyType = ProxyType.RESIDENTIAL;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
