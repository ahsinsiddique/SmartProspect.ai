package ai.prospects.repository;

import ai.prospects.entity.CampaignEnrollment;
import ai.prospects.enums.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CampaignEnrollmentRepository extends JpaRepository<CampaignEnrollment, UUID> {
    Page<CampaignEnrollment> findByCampaignId(UUID campaignId, Pageable pageable);
    boolean existsByCampaignIdAndLeadId(UUID campaignId, UUID leadId);

    @Query("SELECT e FROM CampaignEnrollment e WHERE e.status = 'IN_PROGRESS' AND e.nextActionAt <= :now")
    List<CampaignEnrollment> findDueEnrollments(OffsetDateTime now);

    long countByCampaignIdAndStatus(UUID campaignId, EnrollmentStatus status);
}
