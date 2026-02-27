package ai.prospects.repository;

import ai.prospects.entity.Campaign;
import ai.prospects.enums.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {
    Page<Campaign> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    Optional<Campaign> findByIdAndUserId(UUID id, UUID userId);
    List<Campaign> findByUserIdAndStatus(UUID userId, CampaignStatus status);
    long countByUserId(UUID userId);
}
