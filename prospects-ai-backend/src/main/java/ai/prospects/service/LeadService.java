package ai.prospects.service;

import ai.prospects.dto.request.LeadRequest;
import ai.prospects.dto.response.LeadResponse;
import ai.prospects.entity.Lead;
import ai.prospects.entity.LeadList;
import ai.prospects.entity.User;
import ai.prospects.enums.LeadSource;
import ai.prospects.enums.LeadStatus;
import ai.prospects.exception.ResourceNotFoundException;
import ai.prospects.repository.LeadListRepository;
import ai.prospects.repository.LeadRepository;
import ai.prospects.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadListRepository leadListRepository;

    public Page<LeadResponse> getLeads(UserPrincipal principal, int page, int size,
                                        String status, String source, String company,
                                        String industry, UUID leadListId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Specification<Lead> spec = buildSpec(principal.getId(), status, source, company, industry, leadListId);
        return leadRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public LeadResponse getLead(UUID id, UserPrincipal principal) {
        return toResponse(findAndVerify(id, principal.getId()));
    }

    @Transactional
    public LeadResponse createLead(LeadRequest request, UserPrincipal principal) {
        Lead lead = buildLead(request, principal.getId());
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public LeadResponse updateLead(UUID id, LeadRequest request, UserPrincipal principal) {
        Lead lead = findAndVerify(id, principal.getId());
        applyRequest(lead, request, principal.getId());
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public void deleteLead(UUID id, UserPrincipal principal) {
        leadRepository.delete(findAndVerify(id, principal.getId()));
    }

    private Specification<Lead> buildSpec(UUID userId, String status, String source,
                                           String company, String industry, UUID leadListId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), LeadStatus.valueOf(status.toUpperCase())));
            }
            if (source != null && !source.isBlank()) {
                predicates.add(cb.equal(root.get("source"), LeadSource.valueOf(source.toUpperCase())));
            }
            if (company != null && !company.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("company")), "%" + company.toLowerCase() + "%"));
            }
            if (industry != null && !industry.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("industry")), "%" + industry.toLowerCase() + "%"));
            }
            if (leadListId != null) {
                predicates.add(cb.equal(root.get("leadList").get("id"), leadListId));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Lead findAndVerify(UUID id, UUID userId) {
        return leadRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
    }

    private Lead buildLead(LeadRequest request, UUID userId) {
        User user = new User();
        setId(user, userId);

        Lead.LeadBuilder builder = Lead.builder()
            .user(user)
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .linkedinUrl(request.getLinkedinUrl())
            .company(request.getCompany())
            .title(request.getTitle())
            .industry(request.getIndustry())
            .location(request.getLocation())
            .summary(request.getSummary())
            .customFields(request.getCustomFields());

        if (request.getSource() != null) {
            builder.source(LeadSource.valueOf(request.getSource().toUpperCase()));
        }
        if (request.getLeadListId() != null) {
            LeadList list = leadListRepository.findById(request.getLeadListId()).orElse(null);
            builder.leadList(list);
        }
        return builder.build();
    }

    private void applyRequest(Lead lead, LeadRequest request, UUID userId) {
        if (request.getFirstName() != null) lead.setFirstName(request.getFirstName());
        if (request.getLastName() != null) lead.setLastName(request.getLastName());
        if (request.getEmail() != null) lead.setEmail(request.getEmail());
        if (request.getLinkedinUrl() != null) lead.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getCompany() != null) lead.setCompany(request.getCompany());
        if (request.getTitle() != null) lead.setTitle(request.getTitle());
        if (request.getIndustry() != null) lead.setIndustry(request.getIndustry());
        if (request.getLocation() != null) lead.setLocation(request.getLocation());
        if (request.getSummary() != null) lead.setSummary(request.getSummary());
        if (request.getCustomFields() != null) lead.setCustomFields(request.getCustomFields());
        if (request.getLeadListId() != null) {
            leadListRepository.findByIdAndUserId(request.getLeadListId(), userId)
                .ifPresent(lead::setLeadList);
        }
    }

    private LeadResponse toResponse(Lead l) {
        return LeadResponse.builder()
            .id(l.getId())
            .firstName(l.getFirstName())
            .lastName(l.getLastName())
            .email(l.getEmail())
            .linkedinUrl(l.getLinkedinUrl())
            .linkedinProfileId(l.getLinkedinProfileId())
            .company(l.getCompany())
            .title(l.getTitle())
            .industry(l.getIndustry())
            .location(l.getLocation())
            .summary(l.getSummary())
            .status(l.getStatus().name())
            .source(l.getSource().name())
            .leadListId(l.getLeadList() != null ? l.getLeadList().getId() : null)
            .leadListName(l.getLeadList() != null ? l.getLeadList().getName() : null)
            .customFields(l.getCustomFields())
            .createdAt(l.getCreatedAt())
            .updatedAt(l.getUpdatedAt())
            .build();
    }

    private void setId(User user, UUID id) {
        try {
            var f = ai.prospects.entity.BaseEntity.class.getDeclaredField("id");
            f.setAccessible(true);
            f.set(user, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
