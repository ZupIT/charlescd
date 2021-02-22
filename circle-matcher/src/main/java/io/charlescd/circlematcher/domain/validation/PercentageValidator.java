package io.charlescd.circlematcher.domain.validation;

import io.charlescd.circlematcher.api.request.SegmentationRequest;
import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PercentageValidator implements ConstraintValidator<PercentageConstraint, SegmentationRequest> {
    KeyMetadataRepository keyMetadataRepository;

    public PercentageValidator(KeyMetadataRepository keyMetadataRepository) {
        this.keyMetadataRepository = keyMetadataRepository;
    }

    @Override
    public void initialize(PercentageConstraint constraintAnnotation) {

    }

    @Override
    public boolean isValid(SegmentationRequest segmentation, ConstraintValidatorContext constraintValidatorContext) {
        if (segmentation.getType() != SegmentationType.PERCENTAGE) {
            return true;
        }
        var sumPercentageWorkspace = this.keyMetadataRepository.findByWorkspaceId(
                segmentation.getWorkspaceId()
        ).stream().parallel().filter(
                keyMetadata -> keyMetadata.isPercentage()
                        && keyMetadata.isActive()
                        && !keyMetadata.getReference().equals(segmentation.getReference())
        ).map(
                KeyMetadata::getPercentage
        ).reduce(Integer::sum);
        if (sumPercentageWorkspace.isPresent() && segmentation.isActive()) {
            if (sumPercentageWorkspace.get() + segmentation.getPercentage() > 100) {
                return false;
            } else {
                return segmentation.hasValidPercentage();
            }
        }
        return segmentation.hasValidPercentage();
    }
}
