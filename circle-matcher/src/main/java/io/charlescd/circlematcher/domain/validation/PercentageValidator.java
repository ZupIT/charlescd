package io.charlescd.circlematcher.domain.validation;

import io.charlescd.circlematcher.api.request.SegmentationRequest;
import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.Segmentation;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.domain.exception.BusinessException;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.stream.Collectors;

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
       var sumPercentageWorkspace = this.keyMetadataRepository.findByWorkspaceId(segmentation.getWorkspaceId()).stream().parallel().filter(
               keyMetadata -> keyMetadata.isPercentage() && keyMetadata.isActive()
       ).map(
               KeyMetadata::getPercentage
       ).reduce(Integer::sum);
       if (sumPercentageWorkspace.isPresent()) {
           if (sumPercentageWorkspace.get() + segmentation.getPercentage() > 100) {
               return false;
           } else {
               return segmentation.hasValidPercentage();
           }
       }
        return segmentation.hasValidPercentage();
    }
}
