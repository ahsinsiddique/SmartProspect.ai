package ai.prospects.service;

import ai.prospects.dto.request.ProxyRequest;
import ai.prospects.dto.response.ProxyResponse;
import ai.prospects.entity.Proxy;
import ai.prospects.entity.User;
import ai.prospects.enums.ProxyType;
import ai.prospects.exception.ResourceNotFoundException;
import ai.prospects.repository.ProxyRepository;
import ai.prospects.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProxyService {

    private final ProxyRepository proxyRepository;
    private final EncryptionService encryptionService;

    public List<ProxyResponse> getProxies(UserPrincipal principal) {
        return proxyRepository.findByUserIdOrderByCreatedAtDesc(principal.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProxyResponse createProxy(ProxyRequest request, UserPrincipal principal) {
        User user = new User();
        setId(user, principal.getId());

        Proxy proxy = Proxy.builder()
            .user(user)
            .label(request.getLabel())
            .host(request.getHost())
            .port(request.getPort())
            .username(request.getUsername())
            .passwordEnc(request.getPassword() != null ? encryptionService.encrypt(request.getPassword()) : null)
            .proxyType(ProxyType.valueOf(request.getProxyType()))
            .build();

        return toResponse(proxyRepository.save(proxy));
    }

    @Transactional
    public void deleteProxy(UUID id, UserPrincipal principal) {
        Proxy proxy = proxyRepository.findByIdAndUserId(id, principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Proxy", "id", id));
        proxyRepository.delete(proxy);
    }

    private ProxyResponse toResponse(Proxy p) {
        return ProxyResponse.builder()
            .id(p.getId())
            .label(p.getLabel())
            .host(p.getHost())
            .port(p.getPort())
            .username(p.getUsername())
            .proxyType(p.getProxyType().name())
            .isActive(p.getIsActive())
            .createdAt(p.getCreatedAt())
            .build();
    }

    @SuppressWarnings("unchecked")
    private <T extends ai.prospects.entity.BaseEntity> void setId(T entity, UUID id) {
        try {
            var f = ai.prospects.entity.BaseEntity.class.getDeclaredField("id");
            f.setAccessible(true);
            f.set(entity, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
