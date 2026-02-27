package ai.prospects.repository;

import ai.prospects.entity.LinkedInAccount;
import ai.prospects.enums.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LinkedInAccountRepository extends JpaRepository<LinkedInAccount, UUID> {
    List<LinkedInAccount> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<LinkedInAccount> findByIdAndUserId(UUID id, UUID userId);
    List<LinkedInAccount> findByUserIdAndStatus(UUID userId, AccountStatus status);

    @Modifying
    @Query("UPDATE LinkedInAccount a SET a.connectionsSentToday = 0, a.messagesSentToday = 0")
    void resetDailyCounters();
}
