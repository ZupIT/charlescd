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
import br.com.zup.darwin.circle.matcher.domain.service.impl.IdentificationServiceImpl
import br.com.zup.darwin.circle.matcher.domain.service.impl.ScriptManagerServiceImpl
import br.com.zup.darwin.circle.matcher.utils.TestUtils
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

        def request = new HashMap()
        request.put(key, value)

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

        1 * keyMetadataRepository.find() >> metadataList
        1 * segmentationRepository.isMember(composedKey, value) >> boolean

        notThrown()
    }

    def "should identify user circle using the regular strategy"() {

        given:

        def key = "username"
        def composedKey = "username:28840781-d86e-4803-a742-53566c140e56:REGULAR"
        def value = "user@zup.com.br"

        def request = new HashMap()
        request.put(key, value)

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

        1 * keyMetadataRepository.find() >> metadataList
        1 * segmentationRepository.findByKey(composedKey) >> Optional.of(segmentation)

        notThrown()
    }

    def "should identify default circle"() {

        given:

        def key = "username"
        def composedKey = "username:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"
        def value = "user@zup.com.br"
        def wrongValue = "anotheruser@zup.com.br"

        def request = new HashMap()
        request.put(key, wrongValue)

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
        assert response.size() == 1
        assert response[0].name == "Open Sea"
        assert response[0].id == "f5d23a57-5607-4306-9993-477e1598cc2a"

        1 * keyMetadataRepository.find() >> metadataList
        1 * segmentationRepository.isMember(composedKey, wrongValue) >> false
        0 * segmentationRepository.isMember(composedKey, value)

        notThrown()
    }

    def "should not identify the same circle twice"() {

        given:

        def key = "username"
        def composedKey = "username:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"
        def value = "user@zup.com.br"

        def secondKey = "age"
        def secondaryComposedKey = "age:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"
        def secondValue = "30"

        def request = new HashMap()
        request.put(key, value)
        request.put(secondKey, secondValue)

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

        1 * keyMetadataRepository.find() >> metadataList
        1 * segmentationRepository.isMember(composedKey, value) >> true
        1 * segmentationRepository.isMember(secondaryComposedKey, secondValue) >> true

        notThrown()
    }

}
