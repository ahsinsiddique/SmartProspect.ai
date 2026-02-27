package ai.prospects.repository;

import ai.prospects.entity.LeadList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeadListRepository extends JpaRepository<LeadList, UUID> {
    List<LeadList> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<LeadList> findByIdAndUserId(UUID id, UUID userId);
}
