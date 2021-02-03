package io.charlescd.circlematcher.configuration

import io.charlescd.circlematcher.api.configuration.ApplicationReadyListener
import io.charlescd.circlematcher.domain.KeyMetadata
import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository
import io.charlescd.circlematcher.utils.TestUtils
import org.springframework.boot.context.event.ApplicationReadyEvent
import spock.lang.Specification


class ApplicationReadyEventTest extends Specification {

    def "if no metadata has been found should not create or remove segmentation" () {
        def value = "user@zup.com.br"
        def content = TestUtils.createContent([value])
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV, true)
        def keyMetadata = new KeyMetadata(content.getKey(), segmentation)
        given:
        def segmentationRepository  = Mock(SegmentationRepository)
        def keymetadatRepository  = Mock(KeyMetadataRepository)
        def applicationReadyEvent  = Mock(ApplicationReadyEvent)
        def applicationReadyListener = new ApplicationReadyListener(keymetadatRepository, segmentationRepository)
        when:
        applicationReadyListener.onApplicationEvent(applicationReadyEvent)
        then:
        1 * keymetadatRepository.findAllOldMetadata() >> []
        0 * keymetadatRepository.create(keyMetadata)
        0 * keymetadatRepository.remove(keyMetadata)
        0 * segmentationRepository.removeByKey(content.getKey())
        0 * segmentationRepository.create(content.getKey(), segmentation)

    }
    def "if found metadata and is  simple_kv should update metadata but not update segmentation " () {
        def value = "user@zup.com.br"
        def content = TestUtils.createContent([value])
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV, true)
        def keyMetadata = new KeyMetadata(content.getKey(), segmentation)
        given:
        def segmentationRepository  = Mock(SegmentationRepository)
        def keymetadatRepository  = Mock(KeyMetadataRepository)
        def applicationReadyEvent  = Mock(ApplicationReadyEvent)
        def applicationReadyListener = new ApplicationReadyListener(keymetadatRepository, segmentationRepository)
        when:
        applicationReadyListener.onApplicationEvent(applicationReadyEvent)
        then:
        1 * keymetadatRepository.findAllOldMetadata() >> [keyMetadata]
        1 * keymetadatRepository.create(keyMetadata)
        1 * keymetadatRepository.remove(keyMetadata)
        0 * segmentationRepository.removeByKey(content.getKey())
        0 * segmentationRepository.create(content.getKey(), segmentation)
    }
    def "if found metadata and is regular should update metadata and update segmentation " () {
        def value = "user@zup.com.br"
        def content = TestUtils.createContent([value])
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.REGULAR, true)
        sout
        def keyMetadata = new KeyMetadata(content.getKey(), segmentation)
        given:
        def segmentationRepository  = Mock(SegmentationRepository)
        def keymetadatRepository  = Mock(KeyMetadataRepository)
        def applicationReadyEvent  = Mock(ApplicationReadyEvent)
        def applicationReadyListener = new ApplicationReadyListener(keymetadatRepository, segmentationRepository)
        when:
        applicationReadyListener.onApplicationEvent(applicationReadyEvent)
        then:
        1 * keymetadatRepository.findAllOldMetadata() >> [keyMetadata]
        1 * segmentationRepository.findByKey(content.getKey()) >> Optional.of(segmentation)
        1 * keymetadatRepository.create(keyMetadata)
        1 * keymetadatRepository.remove(keyMetadata)
        1 * segmentationRepository.removeByKey(content.getKey())
        1 * segmentationRepository.create(content.getKey(), segmentation)
    }
}
