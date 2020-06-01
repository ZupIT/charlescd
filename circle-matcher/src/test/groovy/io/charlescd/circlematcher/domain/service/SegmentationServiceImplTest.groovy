/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.circlematcher.domain.service


import io.charlescd.circlematcher.domain.KeyMetadata
import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.domain.service.impl.SegmentationServiceImpl
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository
import io.charlescd.circlematcher.utils.TestUtils
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
