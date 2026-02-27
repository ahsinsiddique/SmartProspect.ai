package ai.prospects.repository;

import ai.prospects.entity.Proxy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProxyRepository extends JpaRepository<Proxy, UUID> {
    List<Proxy> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Proxy> findByIdAndUserId(UUID id, UUID userId);
}
