/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure.repository

import br.com.zup.darwin.circle.matcher.domain.KeyMetadata
import br.com.zup.darwin.circle.matcher.domain.SegmentationType
import br.com.zup.darwin.circle.matcher.utils.TestUtils
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.data.redis.core.Cursor
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.SetOperations
import spock.lang.Specification

class KeyMetadataRepositoryTest extends Specification {

    private KeyMetadataRepository keyMetadataRepository

    private ObjectMapper objectMapper = new ObjectMapper()
    private RedisTemplate<String, Object> redisTemplate = Mock(RedisTemplate)
    private SetOperations setOperations = Mock(SetOperations)
    private Cursor cursor = Mock(Cursor)

    void setup() {
        keyMetadataRepository = new KeyMetadataRepository(redisTemplate, objectMapper)
    }

    def "should create a new key metadata record"() {

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

        def response = keyMetadataRepository.create(keyMetadata)

        then:

        assert response == keyMetadata

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.add(_, _)

        notThrown()

    }

    def "should find all key metadata records"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def metadataList = new ArrayList<KeyMetadata>()
        metadataList.add(keyMetadata)

        when:

        def response = keyMetadataRepository.find()

        then:

        assert response[0].key == metadataList[0].key
        assert response[0].name == metadataList[0].name
        assert response[0].type == metadataList[0].type
        assert response[0].reference == metadataList[0].reference

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.members(_) >> metadataList

        notThrown()
    }

    def "should find key metadata by its reference"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def metadataList = new ArrayList<KeyMetadata>()
        metadataList.add(keyMetadata)

        when:

        def response = keyMetadataRepository.findByReference(keyMetadata.reference)

        then:

        assert response[0].key == metadataList[0].key
        assert response[0].name == metadataList[0].name
        assert response[0].type == metadataList[0].type
        assert response[0].reference == metadataList[0].reference

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.scan(_, _) >> cursor
        1 * cursor.isClosed() >> false
        1 * cursor.isClosed() >> true
        1 * cursor.hasNext() >> true
        1 * cursor.isClosed() >> true
        1 * cursor.next() >> keyMetadata

        notThrown()
    }

    def "should find key metadata by circle id"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def metadataList = new ArrayList<KeyMetadata>()
        metadataList.add(keyMetadata)

        when:

        def response = keyMetadataRepository.findByCircleId(keyMetadata.circleId)

        then:

        assert response[0].key == metadataList[0].key
        assert response[0].name == metadataList[0].name
        assert response[0].type == metadataList[0].type
        assert response[0].reference == metadataList[0].reference

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.scan(_, _) >> cursor
        1 * cursor.isClosed() >> false
        1 * cursor.isClosed() >> true
        1 * cursor.hasNext() >> true
        1 * cursor.isClosed() >> true
        1 * cursor.next() >> keyMetadata

        notThrown()
    }

    def "should remove a key metadata"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"
        def keyMetadata = new KeyMetadata(composedKey, segmentation)
        def metadataList = new ArrayList<KeyMetadata>()
        metadataList.add(keyMetadata)

        when:

        keyMetadataRepository.remove(keyMetadata)

        then:

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.remove(_, keyMetadata)

        notThrown()

    }
}
