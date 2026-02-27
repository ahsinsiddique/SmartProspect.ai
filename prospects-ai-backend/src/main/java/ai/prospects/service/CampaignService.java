package ai.prospects.service;

import ai.prospects.dto.request.CampaignRequest;
import ai.prospects.dto.request.CampaignStepRequest;
import ai.prospects.dto.response.CampaignResponse;
import ai.prospects.dto.response.CampaignStepResponse;
import ai.prospects.entity.*;
import ai.prospects.enums.CampaignStatus;
import ai.prospects.enums.StepType;
import ai.prospects.exception.BadRequestException;
import ai.prospects.exception.ResourceNotFoundException;
import ai.prospects.repository.*;
import ai.prospects.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignStepRepository stepRepository;
    private final CampaignEnrollmentRepository enrollmentRepository;
    private final LinkedInAccountRepository linkedInAccountRepository;
    private final LeadRepository leadRepository;

    public Page<CampaignResponse> getCampaigns(UserPrincipal principal, int page, int size) {
        return campaignRepository.findByUserIdOrderByCreatedAtDesc(
            principal.getId(), PageRequest.of(page, size, Sort.by("createdAt").descending())
        ).map(this::toResponse);
    }

    public CampaignResponse getCampaign(UUID id, UserPrincipal principal) {
        return toResponse(findAndVerify(id, principal.getId()));
    }

    @Transactional
    public CampaignResponse createCampaign(CampaignRequest request, UserPrincipal principal) {
        User user = new User();
        setId(user, principal.getId());

        Campaign.CampaignBuilder builder = Campaign.builder()
            .user(user)
            .name(request.getName())
            .description(request.getDescription());

        if (request.getLinkedInAccountId() != null) {
            LinkedInAccount account = linkedInAccountRepository
                .findByIdAndUserId(request.getLinkedInAccountId(), principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("LinkedIn account", "id", request.getLinkedInAccountId()));
            builder.linkedInAccount(account);
        }

        return toResponse(campaignRepository.save(builder.build()));
    }

    @Transactional
    public CampaignResponse updateCampaign(UUID id, CampaignRequest request, UserPrincipal principal) {
        Campaign campaign = findAndVerify(id, principal.getId());
        campaign.setName(request.getName());
        if (request.getDescription() != null) campaign.setDescription(request.getDescription());
        if (request.getLinkedInAccountId() != null) {
            linkedInAccountRepository.findByIdAndUserId(request.getLinkedInAccountId(), principal.getId())
                .ifPresent(campaign::setLinkedInAccount);
        }
        return toResponse(campaignRepository.save(campaign));
    }

    @Transactional
    public void deleteCampaign(UUID id, UserPrincipal principal) {
        campaignRepository.delete(findAndVerify(id, principal.getId()));
    }

    @Transactional
    public CampaignResponse updateStatus(UUID id, String status, UserPrincipal principal) {
        Campaign campaign = findAndVerify(id, principal.getId());
        try {
            campaign.setStatus(CampaignStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid campaign status: " + status);
        }
        return toResponse(campaignRepository.save(campaign));
    }

    @Transactional
    public CampaignStepResponse addStep(UUID campaignId, CampaignStepRequest request,
                                         UserPrincipal principal) {
        Campaign campaign = findAndVerify(campaignId, principal.getId());
        int nextOrder = campaign.getSteps().size() + 1;

        CampaignStep step = CampaignStep.builder()
            .campaign(campaign)
            .stepOrder(request.getStepOrder() != null ? request.getStepOrder() : nextOrder)
            .stepType(StepType.valueOf(request.getStepType().toUpperCase()))
            .messageTemplate(request.getMessageTemplate())
            .aiPersonalize(request.getAiPersonalize() != null && request.getAiPersonalize())
            .delayDays(request.getDelayDays() != null ? request.getDelayDays() : 0)
            .delayHours(request.getDelayHours() != null ? request.getDelayHours() : 0)
            .build();

        return toStepResponse(stepRepository.save(step));
    }

    @Transactional
    public CampaignStepResponse updateStep(UUID campaignId, UUID stepId, CampaignStepRequest request,
                                            UserPrincipal principal) {
        findAndVerify(campaignId, principal.getId());
        CampaignStep step = stepRepository.findByIdAndCampaignId(stepId, campaignId)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign step", "id", stepId));

        if (request.getStepType() != null) step.setStepType(StepType.valueOf(request.getStepType().toUpperCase()));
        if (request.getMessageTemplate() != null) step.setMessageTemplate(request.getMessageTemplate());
        if (request.getAiPersonalize() != null) step.setAiPersonalize(request.getAiPersonalize());
        if (request.getDelayDays() != null) step.setDelayDays(request.getDelayDays());
        if (request.getDelayHours() != null) step.setDelayHours(request.getDelayHours());

        return toStepResponse(stepRepository.save(step));
    }

    @Transactional
    public void deleteStep(UUID campaignId, UUID stepId, UserPrincipal principal) {
        findAndVerify(campaignId, principal.getId());
        CampaignStep step = stepRepository.findByIdAndCampaignId(stepId, campaignId)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign step", "id", stepId));
        stepRepository.delete(step);
    }

    @Transactional
    public void enrollLead(UUID campaignId, UUID leadId, UserPrincipal principal) {
        Campaign campaign = findAndVerify(campaignId, principal.getId());
        Lead lead = leadRepository.findByIdAndUserId(leadId, principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        if (enrollmentRepository.existsByCampaignIdAndLeadId(campaignId, leadId)) {
            throw new BadRequestException("Lead is already enrolled in this campaign");
        }

        CampaignEnrollment enrollment = CampaignEnrollment.builder()
            .campaign(campaign)
            .lead(lead)
            .build();

        enrollmentRepository.save(enrollment);
        campaign.setTotalEnrolled(campaign.getTotalEnrolled() + 1);
        campaignRepository.save(campaign);
    }

    private Campaign findAndVerify(UUID id, UUID userId) {
        return campaignRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign", "id", id));
    }

    private CampaignResponse toResponse(Campaign c) {
        List<CampaignStepResponse> steps = c.getSteps().stream()
            .map(this::toStepResponse).collect(Collectors.toList());

        return CampaignResponse.builder()
            .id(c.getId())
            .name(c.getName())
            .description(c.getDescription())
            .status(c.getStatus().name())
            .totalEnrolled(c.getTotalEnrolled())
            .totalConnected(c.getTotalConnected())
            .totalReplied(c.getTotalReplied())
            .linkedInAccountId(c.getLinkedInAccount() != null ? c.getLinkedInAccount().getId() : null)
            .linkedInAccountName(c.getLinkedInAccount() != null ? c.getLinkedInAccount().getFullName() : null)
            .steps(steps)
            .createdAt(c.getCreatedAt())
            .updatedAt(c.getUpdatedAt())
            .build();
    }

    private CampaignStepResponse toStepResponse(CampaignStep s) {
        return CampaignStepResponse.builder()
            .id(s.getId())
            .stepOrder(s.getStepOrder())
            .stepType(s.getStepType().name())
            .messageTemplate(s.getMessageTemplate())
            .aiPersonalize(s.getAiPersonalize())
            .delayDays(s.getDelayDays())
            .delayHours(s.getDelayHours())
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
