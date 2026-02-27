package ai.prospects.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lead_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadList extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
