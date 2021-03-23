package io.charlescd.circlematcher.domain.validation;

import io.charlescd.circlematcher.api.request.UpdateSegmentationRequest;
import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UpdatePercentageValidator
        implements ConstraintValidator<UpdatePercentageConstraint, UpdateSegmentationRequest> {
    KeyMetadataRepository keyMetadataRepository;

    public UpdatePercentageValidator(KeyMetadataRepository keyMetadataRepository) {
        this.keyMetadataRepository = keyMetadataRepository;
    }

    @Override
    public void initialize(UpdatePercentageConstraint constraintAnnotation) {

    }

    @Override
    public boolean isValid(
            UpdateSegmentationRequest segmentation,
            ConstraintValidatorContext constraintValidatorContext
    ) {
        if (segmentation.getType() != SegmentationType.PERCENTAGE) {
            return true;
        }
        var sumPercentageWorkspace = this.keyMetadataRepository.findByWorkspaceId(
                segmentation.getWorkspaceId()
        ).stream().parallel().filter(
                keyMetadata -> keyMetadata.isPercentage()
                        && keyMetadata.isActive()
                        && !keyMetadata.getReference().equals(segmentation.getPreviousReference())
        ).map(
                KeyMetadata::getPercentage
        ).reduce(Integer::sum);
        if (sumPercentageWorkspace.isPresent() && segmentation.isActive()) {
            if (sumPercentageWorkspace.get() + segmentation.getPercentage() > 100) {
                addErrorMessage(constraintValidatorContext, "Sum of percentage of active circles exceeded 100 percent");
                return false;
            } else {
                return segmentation.hasValidPercentage();
            }
        }
        return segmentation.hasValidPercentage();
    }

    public void addErrorMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(
                        message
                ).addPropertyNode("percentage").addConstraintViolation();
    }
}
