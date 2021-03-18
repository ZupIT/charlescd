package io.charlescd.circlematcher.domain.validation

import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository
import io.charlescd.circlematcher.utils.TestUtils
import spock.lang.Specification

import javax.validation.ConstraintValidatorContext

class UpdatePercentageValidationTest extends Specification {

    def "when limit of percentage reached should allow creation of inactive segmentation"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def inactiveSegmentationRequest = TestUtils.createUpdateSegmentationRequest(null, SegmentationType.PERCENTAGE, 20, false)
        def activeSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 90)
        def anotherActiveSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 10)
        def activeMetadata = TestUtils.createKeyMetadata(null, activeSegmentation)
        def anotherActiveMetadata = TestUtils.createKeyMetadata(null, anotherActiveSegmentation)

        when:
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def valid = validator.isValid(inactiveSegmentationRequest, null)
        then:
        keyMetadataRepository.findByWorkspaceId(inactiveSegmentationRequest.workspaceId) >> [activeMetadata, anotherActiveMetadata]
        assert valid
    }

    def "when limit of percentage reached should not allow update of active segmentation"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def activeSegmentationRequest = TestUtils.createUpdateSegmentationRequest(null, SegmentationType.PERCENTAGE, 20, true)
        def activeSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 90)
        def anotherActiveSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 10)
        def activeMetadata = TestUtils.createKeyMetadata(null, activeSegmentation)
        def anotherActiveMetadata = TestUtils.createKeyMetadata(null, anotherActiveSegmentation)
        def constraintContext = Mock(ConstraintValidatorContext)
        def constraintContextBuilder = Mock(ConstraintValidatorContext.ConstraintViolationBuilder)
        def nodeContextBuilder = Mock(ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext)

        when:
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def valid = validator.isValid(activeSegmentationRequest, constraintContext)
        then:
        constraintContext.buildConstraintViolationWithTemplate("Sum of percentage of active circles exceeded 100 percent") >> constraintContextBuilder
        constraintContextBuilder.addPropertyNode("percentage") >> nodeContextBuilder
        keyMetadataRepository.findByWorkspaceId(activeSegmentationRequest.workspaceId) >> [activeMetadata, anotherActiveMetadata]
        assert !valid
    }

    def "when sum of percentage not exceed the limit should allow update of active segmentation"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def activeSegmentationRequest = TestUtils.createUpdateSegmentationRequest(null, SegmentationType.PERCENTAGE, 10, true)
        def activeSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 80)
        def anotherActiveSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 10)
        def activeMetadata = TestUtils.createKeyMetadata(null, activeSegmentation)
        def anotherActiveMetadata = TestUtils.createKeyMetadata(null, anotherActiveSegmentation)

        when:
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def valid = validator.isValid(activeSegmentationRequest, null)
        then:
        keyMetadataRepository.findByWorkspaceId(activeSegmentationRequest.workspaceId) >> [activeMetadata, anotherActiveMetadata]
        assert valid
    }

    def "when sum of percentage exceeds should not allow update of active segmentation"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def activeSegmentationRequest = TestUtils.createUpdateSegmentationRequest(null, SegmentationType.PERCENTAGE, 10, true)
        def activeSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 80)
        def anotherActiveSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 20)
        def activeMetadata = TestUtils.createKeyMetadata(null, activeSegmentation)
        def anotherActiveMetadata = TestUtils.createKeyMetadata(null, anotherActiveSegmentation)
        def constraintContext = Mock(ConstraintValidatorContext)
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def constraintContextBuilder = Mock(ConstraintValidatorContext.ConstraintViolationBuilder)
        def nodeContextBuilder = Mock(ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext)
        when:

        def valid = validator.isValid(activeSegmentationRequest, constraintContext)
        then:

        keyMetadataRepository.findByWorkspaceId(activeSegmentationRequest.workspaceId) >> [activeMetadata, anotherActiveMetadata]
        constraintContext.buildConstraintViolationWithTemplate("Sum of percentage of active circles exceeded 100 percent") >> constraintContextBuilder
        constraintContextBuilder.addPropertyNode("percentage") >> nodeContextBuilder
        assert !valid
    }

    def "when sum of percentage  reached  100% but is a update of a segmentation already created should allow update"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def activeSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 80)
        def activeSegmentationUpdate = TestUtils.createUpdateSegmentationRequest(
                null, SegmentationType.PERCENTAGE,
                activeSegmentation.reference,
                10, true)
        def anotherActiveSegmentation = TestUtils.createPercentageSegmentation(null, SegmentationType.PERCENTAGE, 20)
        def activeMetadata = TestUtils.createKeyMetadata(null, activeSegmentation)
        def anotherActiveMetadata = TestUtils.createKeyMetadata(null, anotherActiveSegmentation)
        activeSegmentationUpdate.reference = activeSegmentation.reference
        when:
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def valid = validator.isValid(activeSegmentationUpdate, null)
        then:
        keyMetadataRepository.findByWorkspaceId(activeSegmentationUpdate.workspaceId) >> [activeMetadata, anotherActiveMetadata]
        assert valid
    }

    def "when is a invalid percentage should not allow creation"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def activeSegmentationRequest = TestUtils.createUpdateSegmentationRequest(null, SegmentationType.PERCENTAGE, 110, true)

        when:
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def valid = validator.isValid(activeSegmentationRequest, null)
        then:
        keyMetadataRepository.findByWorkspaceId(activeSegmentationRequest.workspaceId) >> []
        assert !valid
    }

    def "when is another invalid percentage should not allow creation"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def activeSegmentationRequest = TestUtils.createUpdateSegmentationRequest(null, SegmentationType.PERCENTAGE, -5, true)

        when:
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def valid = validator.isValid(activeSegmentationRequest, null)
        then:
        keyMetadataRepository.findByWorkspaceId(activeSegmentationRequest.workspaceId) >> []
        assert !valid
    }

    def "when is a valid percentage should  allow creation"() {
        given:
        def keyMetadataRepository = Mock(KeyMetadataRepository)
        def activeSegmentationRequest = TestUtils.createUpdateSegmentationRequest(null, SegmentationType.PERCENTAGE, 100, true)

        when:
        def validator = new UpdatePercentageValidator(keyMetadataRepository)
        def valid = validator.isValid(activeSegmentationRequest, null)
        then:
        keyMetadataRepository.findByWorkspaceId(activeSegmentationRequest.workspaceId) >> []
        assert valid
    }


}