package ai.prospects.service;

import ai.prospects.dto.request.LinkedInAccountRequest;
import ai.prospects.dto.response.LinkedInAccountResponse;
import ai.prospects.entity.LinkedInAccount;
import ai.prospects.entity.Proxy;
import ai.prospects.enums.AccountStatus;
import ai.prospects.exception.ResourceNotFoundException;
import ai.prospects.repository.LinkedInAccountRepository;
import ai.prospects.repository.ProxyRepository;
import ai.prospects.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LinkedInAccountService {

    private final LinkedInAccountRepository accountRepository;
    private final ProxyRepository proxyRepository;

    public List<LinkedInAccountResponse> getAccounts(UserPrincipal principal) {
        return accountRepository.findByUserIdOrderByCreatedAtDesc(principal.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public LinkedInAccountResponse getAccount(UUID id, UserPrincipal principal) {
        return toResponse(findAndVerify(id, principal.getId()));
    }

    @Transactional
    public LinkedInAccountResponse createAccount(LinkedInAccountRequest request, UserPrincipal principal) {
        LinkedInAccount account = LinkedInAccount.builder()
            .linkedinEmail(request.getLinkedinEmail())
            .liAtCookie(request.getLiAtCookie())
            .csrfToken(request.getCsrfToken())
            .build();

        account.setUser(buildUserRef(principal.getId()));
        applyOptionalProxy(account, request.getProxyId(), principal.getId());
        applyLimits(account, request);

        return toResponse(accountRepository.save(account));
    }

    @Transactional
    public LinkedInAccountResponse updateAccount(UUID id, LinkedInAccountRequest request,
                                                  UserPrincipal principal) {
        LinkedInAccount account = findAndVerify(id, principal.getId());
        account.setLinkedinEmail(request.getLinkedinEmail());
        if (request.getLiAtCookie() != null) account.setLiAtCookie(request.getLiAtCookie());
        if (request.getCsrfToken() != null) account.setCsrfToken(request.getCsrfToken());
        applyOptionalProxy(account, request.getProxyId(), principal.getId());
        applyLimits(account, request);
        return toResponse(accountRepository.save(account));
    }

    @Transactional
    public void deleteAccount(UUID id, UserPrincipal principal) {
        LinkedInAccount account = findAndVerify(id, principal.getId());
        accountRepository.delete(account);
    }

    @Transactional
    public LinkedInAccountResponse connect(UUID id, UserPrincipal principal) {
        LinkedInAccount account = findAndVerify(id, principal.getId());
        account.setStatus(AccountStatus.CONNECTED);
        account.setLastSyncedAt(OffsetDateTime.now());
        return toResponse(accountRepository.save(account));
    }

    @Transactional
    public LinkedInAccountResponse disconnect(UUID id, UserPrincipal principal) {
        LinkedInAccount account = findAndVerify(id, principal.getId());
        account.setStatus(AccountStatus.DISCONNECTED);
        return toResponse(accountRepository.save(account));
    }

    @Scheduled(cron = "0 0 0 * * UTC")
    @Transactional
    public void resetDailyCounters() {
        accountRepository.resetDailyCounters();
    }

    private LinkedInAccount findAndVerify(UUID id, UUID userId) {
        return accountRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResourceNotFoundException("LinkedIn account", "id", id));
    }

    private void applyOptionalProxy(LinkedInAccount account, UUID proxyId, UUID userId) {
        if (proxyId != null) {
            Proxy proxy = proxyRepository.findByIdAndUserId(proxyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Proxy", "id", proxyId));
            account.setProxy(proxy);
        }
    }

    private void applyLimits(LinkedInAccount account, LinkedInAccountRequest request) {
        if (request.getDailyConnectionLimit() != null) {
            account.setDailyConnectionLimit(request.getDailyConnectionLimit());
        }
        if (request.getDailyMessageLimit() != null) {
            account.setDailyMessageLimit(request.getDailyMessageLimit());
        }
    }

    private ai.prospects.entity.User buildUserRef(UUID userId) {
        ai.prospects.entity.User u = new ai.prospects.entity.User();
        // Use a proxy/reference pattern - Spring Data handles this
        try {
            var f = ai.prospects.entity.BaseEntity.class.getDeclaredField("id");
            f.setAccessible(true);
            f.set(u, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return u;
    }

    private LinkedInAccountResponse toResponse(LinkedInAccount a) {
        return LinkedInAccountResponse.builder()
            .id(a.getId())
            .linkedinEmail(a.getLinkedinEmail())
            .memberId(a.getMemberId())
            .fullName(a.getFullName())
            .headline(a.getHeadline())
            .profilePictureUrl(a.getProfilePictureUrl())
            .status(a.getStatus().name())
            .dailyConnectionLimit(a.getDailyConnectionLimit())
            .dailyMessageLimit(a.getDailyMessageLimit())
            .connectionsSentToday(a.getConnectionsSentToday())
            .messagesSentToday(a.getMessagesSentToday())
            .proxyId(a.getProxy() != null ? a.getProxy().getId() : null)
            .proxyLabel(a.getProxy() != null ? a.getProxy().getLabel() : null)
            .lastSyncedAt(a.getLastSyncedAt())
            .createdAt(a.getCreatedAt())
            .build();
    }
}
