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


import io.charlescd.circlematcher.api.request.IdentificationRequest
import io.charlescd.circlematcher.domain.KeyMetadata
import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.domain.service.impl.IdentificationServiceImpl
import io.charlescd.circlematcher.domain.service.impl.ScriptManagerServiceImpl
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository
import io.charlescd.circlematcher.utils.TestUtils
import spock.lang.Specification

class IdentificationServiceImplTest extends Specification {

    private IdentificationService identificationService

    private ScriptManagerServiceImpl scriptManagerService = new ScriptManagerServiceImpl()
    private SegmentationRepository segmentationRepository = Mock(SegmentationRepository)
    private KeyMetadataRepository keyMetadataRepository = Mock(KeyMetadataRepository)

    void setup() {
        identificationService = new IdentificationServiceImpl(
                segmentationRepository,
                scriptManagerService,
                keyMetadataRepository)
    }

    def "should identify user circle"() {

        given:

        def key = "username"
        def composedKey = "username:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"
        def value = "user@zup.com.br"

        def workspaceId = "78094351-7f16-4571-ac7a-7681db81e146"
        def data = new HashMap()
        data.put(key, value)
        def request = new IdentificationRequest(workspaceId, data)

        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)

        def metadataList = new ArrayList()
        metadataList.add(keyMetadata)

        when:

        def response = identificationService.identify(request)

        then:

        assert response != null
        assert !response.isEmpty()
        assert response[0].id == "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        assert response[0].name == "Men"

        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        1 * segmentationRepository.isMember(composedKey, value) >> boolean

        notThrown()
    }

    def "should identify user circle using the regular strategy"() {

        given:

        def key = "username"
        def composedKey = "username:28840781-d86e-4803-a742-53566c140e56:REGULAR"
        def value = "user@zup.com.br"

        def workspaceId = "78094351-7f16-4571-ac7a-7681db81e146"
        def data = new HashMap()
        data.put(key, value)
        def request = new IdentificationRequest(workspaceId, data)

        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.REGULAR)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)

        def metadataList = new ArrayList()
        metadataList.add(keyMetadata)

        when:

        def response = identificationService.identify(request)

        then:

        assert response != null
        assert !response.isEmpty()
        assert response[0].id == "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        assert response[0].name == "Men"

        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        1 * segmentationRepository.findByKey(composedKey) >> Optional.of(segmentation)

        notThrown()
    }

    def "should identify default circle"() {

        given:

        def key = "username"
        def composedKey = "username:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"
        def defaultComposedKey = "DEFAULT:28840781-d86e-4803-a742-53566c140e59:REGULAR"
        def value = "user@zup.com.br"
        def wrongValue = "anotheruser@zup.com.br"

        def workspaceId = "78094351-7f16-4571-ac7a-7681db81e146"
        def data = new HashMap()
        data.put(key, wrongValue)
        def request = new IdentificationRequest(workspaceId, data)

        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def defaultSegmentation = TestUtils.createDefaultSegmentation(null, SegmentationType.REGULAR)
        def defaultMetadata = new KeyMetadata(defaultComposedKey, defaultSegmentation)

        def metadataList = new ArrayList()
        metadataList.add(keyMetadata)
        metadataList.add(defaultMetadata)

        when:

        def response = identificationService.identify(request)

        then:

        notThrown(NoSuchElementException)

        assert response != null
        assert response.size() == 1
        assert response[0].name == "Default"
        assert response[0].id == "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a89"

        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        1 * segmentationRepository.isMember(composedKey, wrongValue) >> false
        0 * segmentationRepository.isMember(composedKey, value)
        1 * segmentationRepository.findByKey(defaultComposedKey) >> Optional.empty()
    }

    def "should not identify the same circle twice"() {

        given:

        def key = "username"
        def composedKey = "username:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"
        def value = "user@zup.com.br"

        def secondKey = "age"
        def secondaryComposedKey = "age:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"
        def secondValue = "30"

        def workspaceId = "78094351-7f16-4571-ac7a-7681db81e146"
        def data = new HashMap()
        data.put(key, value)
        data.put(secondKey, secondValue)
        def request = new IdentificationRequest(workspaceId, data)

        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def keyMetadata = new KeyMetadata(composedKey, segmentation)

        def secondaryValues = new ArrayList()
        secondaryValues.add(secondValue)
        def secondaryContent = TestUtils.createContent(secondaryValues)
        def secondaryNode = TestUtils.createNode(secondaryContent)
        def secondarySegmentation = TestUtils.createSegmentation(secondaryNode, SegmentationType.SIMPLE_KV)
        def secondaryKeyMetadata = new KeyMetadata(secondaryComposedKey, secondarySegmentation)

        def metadataList = new ArrayList()
        metadataList.add(keyMetadata)
        metadataList.add(secondaryKeyMetadata)

        when:

        def response = identificationService.identify(request)

        then:

        assert response != null
        assert response.size() == 1
        assert response[0].id == "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        assert response[0].name == "Men"

        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        1 * segmentationRepository.isMember(composedKey, value) >> true
        1 * segmentationRepository.isMember(secondaryComposedKey, secondValue) >> true

        notThrown()
    }
}
