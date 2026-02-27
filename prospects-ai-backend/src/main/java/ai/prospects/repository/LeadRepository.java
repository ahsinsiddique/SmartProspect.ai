package ai.prospects.repository;

import ai.prospects.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID>, JpaSpecificationExecutor<Lead> {
    Optional<Lead> findByIdAndUserId(UUID id, UUID userId);
    long countByUserId(UUID userId);
}
