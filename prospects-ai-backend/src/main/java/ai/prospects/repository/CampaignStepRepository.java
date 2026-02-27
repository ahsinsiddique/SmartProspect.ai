package ai.prospects.repository;

import ai.prospects.entity.CampaignStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampaignStepRepository extends JpaRepository<CampaignStep, UUID> {
    List<CampaignStep> findByCampaignIdOrderByStepOrderAsc(UUID campaignId);
    Optional<CampaignStep> findByIdAndCampaignId(UUID id, UUID campaignId);
}
