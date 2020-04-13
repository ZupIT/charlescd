/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain.service


import br.com.zup.darwin.circle.matcher.domain.KeyMetadata
import br.com.zup.darwin.circle.matcher.domain.SegmentationType
import br.com.zup.darwin.circle.matcher.infrastructure.repository.KeyMetadataRepository
import br.com.zup.darwin.circle.matcher.infrastructure.repository.SegmentationRepository
import br.com.zup.darwin.circle.matcher.domain.service.impl.SegmentationServiceImpl
import br.com.zup.darwin.circle.matcher.utils.TestUtils
import spock.lang.Specification

class SegmentationServiceImplTest extends Specification {

    private SegmentationService segmentationService

    private SegmentationRepository segmentationRepository = Mock(SegmentationRepository)
    private KeyMetadataRepository keyMetadataRepository = Mock(KeyMetadataRepository)

    void setup() {
        segmentationService = new SegmentationServiceImpl(
                segmentationRepository,
                keyMetadataRepository
        )
    }

    def "should create a segmentation rule"() {

        given:

        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.REGULAR)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def request = TestUtils.createSegmentationRequest(node, SegmentationType.REGULAR)

        when:

        segmentationService.create(request)

        then:

        1 * keyMetadataRepository.create(_) >> keyMetadata
        1 * segmentationRepository.create(composedKey, _)

        notThrown()
    }

    def "should create a segmentation rule with simple kv strategy"() {

        given:

        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def request = TestUtils.createSegmentationRequest(node, SegmentationType.SIMPLE_KV)

        when:

        segmentationService.create(request)

        then:

        1 * keyMetadataRepository.create(_) >> keyMetadata
        1 * segmentationRepository.create(composedKey, "user@zup.com.br")

        notThrown()
    }

    def "should update a segmentation rule"() {

        given:

        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:REGULAR"

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.REGULAR)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def metadataList = new ArrayList()
        metadataList.add(keyMetadata)

        def request = TestUtils.createUpdateSegmentationRequest(node, SegmentationType.REGULAR)

        when:

        segmentationService.update(request)

        then:

        1 * keyMetadataRepository.findByReference("74b21efa-d52f-4266-9e6f-a28f26f7fffd") >> metadataList
        1 * keyMetadataRepository.findByReference("5ae8a1c4-2acb-4eda-9e37-e6e74bc5eebe") >> new ArrayList<>()
        1 * keyMetadataRepository.remove(keyMetadata)
        1 * segmentationRepository.removeByKey(composedKey)

        1 * keyMetadataRepository.create(_) >> keyMetadata
        1 * segmentationRepository.create("username:5ae8a1c4-2acb-4eda-9e37-e6e74bc5eebe:SIMPLE_KV", _)

        notThrown()
    }

    def "should update a segmentation rule with simple kv strategy"() {

        given:

        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def metadataList = new ArrayList()
        metadataList.add(keyMetadata)

        def request = TestUtils.createUpdateSegmentationRequest(node, SegmentationType.SIMPLE_KV)

        when:

        segmentationService.update(request)

        then:

        1 * keyMetadataRepository.findByReference("74b21efa-d52f-4266-9e6f-a28f26f7fffd") >> metadataList
        1 * keyMetadataRepository.findByReference("5ae8a1c4-2acb-4eda-9e37-e6e74bc5eebe") >> new ArrayList<>()
        1 * keyMetadataRepository.remove(keyMetadata)
        1 * segmentationRepository.removeByKey(composedKey)

        1 * keyMetadataRepository.create(_) >> keyMetadata
        1 * segmentationRepository.create("username:5ae8a1c4-2acb-4eda-9e37-e6e74bc5eebe:SIMPLE_KV", value)

        notThrown()
    }

    def "should remove a segmentation rule"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def metadataList = new ArrayList()
        metadataList.add(keyMetadata)

        when:

        segmentationService.remove("74b21efa-d52f-4266-9e6f-a28f26f7fffd")

        then:

        1 * keyMetadataRepository.findByReference("74b21efa-d52f-4266-9e6f-a28f26f7fffd") >> metadataList
        1 * segmentationRepository.removeByKey(composedKey)
        1 * keyMetadataRepository.remove(keyMetadata)
    }

}
