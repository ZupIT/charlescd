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
import io.charlescd.circlematcher.domain.Segmentation
import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.domain.service.impl.IdentificationServiceImpl
import io.charlescd.circlematcher.domain.service.impl.ScriptManagerServiceImpl
import io.charlescd.circlematcher.domain.service.impl.RandomServiceImpl
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository
import io.charlescd.circlematcher.utils.TestUtils
import spock.lang.Specification

import java.time.LocalDateTime

class IdentificationServiceImplTest extends Specification {

    private IdentificationService identificationService
    private ScriptManagerServiceImpl scriptManagerService = new ScriptManagerServiceImpl()
    private SegmentationRepository segmentationRepository = Mock(SegmentationRepository)
    private KeyMetadataRepository keyMetadataRepository = Mock(KeyMetadataRepository)
    private RandomServiceImpl randomUtils = Mock(RandomServiceImpl)

    void setup() {
        identificationService = new IdentificationServiceImpl(
                segmentationRepository,
                scriptManagerService,
                keyMetadataRepository,
                randomUtils
        )

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

    def "when exists a circle with 20% of percentage and RandomValue is 80 should identify default circle "() {
        given:
        def workspaceId = "43865b8e-cde4-4807-b702-e652bf804799"
        def composedKey = "28840781-d86e-4803-a742-53566c140e56:PERCENTAGE"
        def data = new HashMap();
        def metadataList = new ArrayList()
        def node = null
        def segmentationPercentage = TestUtils.createPercentageSegmentation(node, SegmentationType.PERCENTAGE, 20)
        def segmentationDefault = TestUtils.createDefaultSegmentation(node, SegmentationType.REGULAR)
        def keyMetadataPercentage = new KeyMetadata(composedKey, segmentationPercentage)
        def keyMetadataDefault = new KeyMetadata(composedKey, segmentationDefault)
        metadataList.add(keyMetadataPercentage)
        metadataList.add(keyMetadataDefault)
        def request = new IdentificationRequest(workspaceId, data)
        when:
        def response = identificationService.identify(request)

        then:
        assert response != null
        assert response[0].id == segmentationDefault.circleId
        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        0 * segmentationRepository.isMember(composedKey, request)
        2 * segmentationRepository.findByKey(composedKey) >> Optional.empty()
        1 * randomUtils.getRandomNumber(_) >> 80
    }

    def "when exists a circle with 20% of percentage and RandomValue is 15 should identify  circle with percentage "() {
        given:
        def workspaceId = "43865b8e-cde4-4807-b702-e652bf804799"
        def composedKey = "28840781-d86e-4803-a742-53566c140e56:PERCENTAGE"
        def data = new HashMap();
        def metadataList = new ArrayList()
        def node = null
        def segmentationPercentage = TestUtils.createPercentageSegmentation(node, SegmentationType.PERCENTAGE, 20)
        def segmentationDefault = TestUtils.createDefaultSegmentation(node, SegmentationType.REGULAR)
        def keyMetadataPercentage = new KeyMetadata(composedKey, segmentationPercentage)
        def keyMetadataDefault = new KeyMetadata(composedKey, segmentationDefault)
        metadataList.add(keyMetadataPercentage)
        metadataList.add(keyMetadataDefault)
        def request = new IdentificationRequest(workspaceId, data)
        when:
        def response = identificationService.identify(request)

        then:
        assert response != null
        assert response[0].id == segmentationPercentage.circleId
        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        0 * segmentationRepository.isMember(composedKey, request)
        2 * segmentationRepository.findByKey(composedKey) >> Optional.empty()
        1 * randomUtils.getRandomNumber(_) >> 15

    }

    def "when exists  circles A,B,C with percentage 10,15,20 respectively and RandomValue is 25 should identify percentage circle B "() {
        given:
        def workspaceId = "43865b8e-cde4-4807-b702-e652bf804799"
        def composedKey = "28840781-d86e-4803-a742-53566c140e56:PERCENTAGE"
        def data = new HashMap();
        def metadataList = new ArrayList()
        def node = null
        def segmentationPercentage20 = TestUtils.createPercentageSegmentation(node, SegmentationType.PERCENTAGE, 20)
        def segmentationPercentage15 = new Segmentation("Percentage15",
                node,
                "0f5f699a-df28-4517-9cd6-e98f2f775fe3",
                "0a1e179c-9e4a-4d70-a9a1-da5c3ad28c61",
                SegmentationType.PERCENTAGE,
                "7a0c38d1-934e-478a-9dd2-813fa11aca8c",
                false,
                15,
                LocalDateTime.now()
        )
        def segmentationPercentage10 = new Segmentation("Percentage10",
                node,
                "d5e58874-6215-4438-affa-ea4a14e9b2a0 ",
                "f6b29a28-4c4b-480d-ac82-c3d003493040",
                SegmentationType.PERCENTAGE,
                "cd9fa9fb-ec80-4575-9ceb-b39ac3a4a898",
                false,
                10,
                LocalDateTime.now()
        )
        def segmentationDefault = TestUtils.createDefaultSegmentation(node, SegmentationType.REGULAR)
        def keyMetadataPercentage20 = new KeyMetadata(composedKey, segmentationPercentage20)
        def keyMetadataPercentage15 = new KeyMetadata(composedKey, segmentationPercentage15)
        def keyMetadataPercentage10 = new KeyMetadata(composedKey, segmentationPercentage10)
        def keyMetadataDefault = new KeyMetadata(composedKey, segmentationDefault)
        metadataList.add(keyMetadataPercentage20)
        metadataList.add(keyMetadataPercentage15)
        metadataList.add(keyMetadataPercentage10)
        metadataList.add(keyMetadataDefault)
        def request = new IdentificationRequest(workspaceId, data)
        when:
        def response = identificationService.identify(request)

        then:
        assert response != null
        assert response[0].id == segmentationPercentage15.circleId
        assert response[0].name == segmentationPercentage15.name
        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        0 * segmentationRepository.isMember(composedKey, request)
        4 * segmentationRepository.findByKey(composedKey) >> Optional.empty()
        1 * randomUtils.getRandomNumber(_) >> 25

    }

    def "when exists  circles A,B,C with percentage 10,15,20 respectively and RandomValue is 35 should identify percentage circle C "() {
        given:
        def workspaceId = "43865b8e-cde4-4807-b702-e652bf804799"
        def composedKey = "28840781-d86e-4803-a742-53566c140e56:PERCENTAGE"
        def data = new HashMap();
        def metadataList = new ArrayList()
        def node = null
        def segmentationPercentage20 = TestUtils.createPercentageSegmentation(node, SegmentationType.PERCENTAGE, 20)
        def segmentationPercentage15 = new Segmentation("Percentage15",
                node,
                "0f5f699a-df28-4517-9cd6-e98f2f775fe3",
                "0a1e179c-9e4a-4d70-a9a1-da5c3ad28c61",
                SegmentationType.PERCENTAGE,
                "7a0c38d1-934e-478a-9dd2-813fa11aca8c",
                false,
                15,
                LocalDateTime.now()
        )
        def segmentationPercentage10 = new Segmentation("Percentage10",
                node,
                "d5e58874-6215-4438-affa-ea4a14e9b2a0 ",
                "f6b29a28-4c4b-480d-ac82-c3d003493040",
                SegmentationType.PERCENTAGE,
                "cd9fa9fb-ec80-4575-9ceb-b39ac3a4a898",
                false,
                10,
                LocalDateTime.now()
        )
        def segmentationDefault = TestUtils.createDefaultSegmentation(node, SegmentationType.REGULAR)
        def keyMetadataPercentage20 = new KeyMetadata(composedKey, segmentationPercentage20)
        def keyMetadataPercentage15 = new KeyMetadata(composedKey, segmentationPercentage15)
        def keyMetadataPercentage10 = new KeyMetadata(composedKey, segmentationPercentage10)
        def keyMetadataDefault = new KeyMetadata(composedKey, segmentationDefault)
        metadataList.add(keyMetadataPercentage20)
        metadataList.add(keyMetadataPercentage15)
        metadataList.add(keyMetadataPercentage10)
        metadataList.add(keyMetadataDefault)
        def request = new IdentificationRequest(workspaceId, data)
        when:
        def response = identificationService.identify(request)

        then:
        assert response != null
        assert response[0].id == segmentationPercentage20.circleId
        assert response[0].name == segmentationPercentage20.name
        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        0 * segmentationRepository.isMember(composedKey, request)
        4 * segmentationRepository.findByKey(composedKey) >> Optional.empty()
        1 * randomUtils.getRandomNumber(_) >> 35

    }

    def "when exists  circles A,B,C with percentage 10,15,20 respectively and RandomValue is 8 should identify percentage circle A "() {
        given:
        def workspaceId = "43865b8e-cde4-4807-b702-e652bf804799"
        def composedKey = "28840781-d86e-4803-a742-53566c140e56:PERCENTAGE"
        def data = new HashMap();
        def metadataList = new ArrayList()
        def node = null
        def segmentationPercentage20 = TestUtils.createPercentageSegmentation(node, SegmentationType.PERCENTAGE, 20)
        def segmentationPercentage15 = new Segmentation("Percentage15",
                node,
                "0f5f699a-df28-4517-9cd6-e98f2f775fe3",
                "0a1e179c-9e4a-4d70-a9a1-da5c3ad28c61",
                SegmentationType.PERCENTAGE,
                "7a0c38d1-934e-478a-9dd2-813fa11aca8c",
                false,
                15,
                LocalDateTime.now()
        )
        def segmentationPercentage10 = new Segmentation("Percentage10",
                node,
                "d5e58874-6215-4438-affa-ea4a14e9b2a0 ",
                "f6b29a28-4c4b-480d-ac82-c3d003493040",
                SegmentationType.PERCENTAGE,
                "cd9fa9fb-ec80-4575-9ceb-b39ac3a4a898",
                false,
                10,
                LocalDateTime.now()
        )
        def segmentationDefault = TestUtils.createDefaultSegmentation(node, SegmentationType.REGULAR)
        def keyMetadataPercentage20 = new KeyMetadata(composedKey, segmentationPercentage20)
        def keyMetadataPercentage15 = new KeyMetadata(composedKey, segmentationPercentage15)
        def keyMetadataPercentage10 = new KeyMetadata(composedKey, segmentationPercentage10)
        def keyMetadataDefault = new KeyMetadata(composedKey, segmentationDefault)
        metadataList.add(keyMetadataPercentage20)
        metadataList.add(keyMetadataPercentage15)
        metadataList.add(keyMetadataPercentage10)
        metadataList.add(keyMetadataDefault)
        def request = new IdentificationRequest(workspaceId, data)
        when:
        def response = identificationService.identify(request)

        then:
        assert response != null
        assert response[0].id == segmentationPercentage10.circleId
        assert response[0].name == segmentationPercentage10.name
        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        0 * segmentationRepository.isMember(composedKey, request)
        4 * segmentationRepository.findByKey(composedKey) >> Optional.empty()
        1 * randomUtils.getRandomNumber(_) >> 8

    }

    def "when exists  circles A,B,C with percentage 10,15,20 respectively and RandomValue is 70 should identify default "() {
        given:
        def workspaceId = "43865b8e-cde4-4807-b702-e652bf804799"
        def composedKey = "28840781-d86e-4803-a742-53566c140e56:PERCENTAGE"
        def data = new HashMap();
        def metadataList = new ArrayList()
        def node = null
        def segmentationPercentage20 = TestUtils.createPercentageSegmentation(node, SegmentationType.PERCENTAGE, 20)
        def segmentationPercentage15 = new Segmentation("Percentage15",
                node,
                "0f5f699a-df28-4517-9cd6-e98f2f775fe3",
                "0a1e179c-9e4a-4d70-a9a1-da5c3ad28c61",
                SegmentationType.PERCENTAGE,
                "7a0c38d1-934e-478a-9dd2-813fa11aca8c",
                false,
                15,
                LocalDateTime.now()
        )
        def segmentationPercentage10 = new Segmentation("Percentage10",
                node,
                "d5e58874-6215-4438-affa-ea4a14e9b2a0 ",
                "f6b29a28-4c4b-480d-ac82-c3d003493040",
                SegmentationType.PERCENTAGE,
                "cd9fa9fb-ec80-4575-9ceb-b39ac3a4a898",
                false,
                10,
                LocalDateTime.now()
        )
        def segmentationDefault = TestUtils.createDefaultSegmentation(node, SegmentationType.REGULAR)
        def keyMetadataPercentage20 = new KeyMetadata(composedKey, segmentationPercentage20)
        def keyMetadataPercentage15 = new KeyMetadata(composedKey, segmentationPercentage15)
        def keyMetadataPercentage10 = new KeyMetadata(composedKey, segmentationPercentage10)
        def keyMetadataDefault = new KeyMetadata(composedKey, segmentationDefault)
        metadataList.add(keyMetadataPercentage20)
        metadataList.add(keyMetadataPercentage15)
        metadataList.add(keyMetadataPercentage10)
        metadataList.add(keyMetadataDefault)
        def request = new IdentificationRequest(workspaceId, data)
        when:
        def response = identificationService.identify(request)

        then:
        assert response != null
        assert response[0].id == segmentationDefault.circleId
        assert response[0].name == segmentationDefault.name
        1 * keyMetadataRepository.findByWorkspaceId(workspaceId) >> metadataList
        0 * segmentationRepository.isMember(composedKey, request)
        4 * segmentationRepository.findByKey(composedKey) >> Optional.empty()
        1 * randomUtils.getRandomNumber(_) >> 70

    }
}
