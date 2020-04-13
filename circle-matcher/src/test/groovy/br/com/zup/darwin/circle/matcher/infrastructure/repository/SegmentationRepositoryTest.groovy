/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure.repository


import br.com.zup.darwin.circle.matcher.domain.SegmentationType
import br.com.zup.darwin.circle.matcher.utils.TestUtils
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.data.redis.core.Cursor
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.SetOperations
import spock.lang.Specification

class SegmentationRepositoryTest extends Specification {

    private SegmentationRepository segmentationRepository

    private RedisTemplate<String, Object> redisTemplate = Mock(RedisTemplate)
    private ObjectMapper objectMapper = new ObjectMapper()
    private SetOperations setOperations = Mock(SetOperations)
    private Cursor cursor = Mock(Cursor)

    void setup() {
        segmentationRepository = new SegmentationRepository(redisTemplate, objectMapper)
    }

    def "FindByKey"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)

        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV)
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"

        when:

        def response = segmentationRepository.findByKey(composedKey)

        then:

        assert response.isPresent()
        assert response.get().circleId == segmentation.circleId
        assert response.get().reference == segmentation.reference
        assert response.get().type == segmentation.type
        assert response.get().name == segmentation.name

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.scan(_, _) >> cursor
        1 * cursor.isClosed() >> false
        1 * cursor.hasNext() >> true
        1 * cursor.next() >> segmentation
        1 * cursor.isClosed() >> true

        notThrown()
    }

    def "IsMember"() {

        given:

        def value = "user@zup.com.br"
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"

        when:

        def response = segmentationRepository.isMember(composedKey, value)

        then:

        assert response

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.isMember(composedKey, value) >> true

        notThrown()
    }

    def "Create"() {

        given:

        def value = "user@zup.com.br"
        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"

        when:

        segmentationRepository.create(composedKey, value)

        then:

        1 * redisTemplate.opsForSet() >> setOperations
        1 * setOperations.add(composedKey, value) >> 1L

        notThrown()
    }

    def "RemoveByKey"() {

        given:

        def composedKey = "username:74b21efa-d52f-4266-9e6f-a28f26f7fffd:SIMPLE_KV"

        when:

        segmentationRepository.removeByKey(composedKey)

        then:

        1 * redisTemplate.delete(composedKey) >> 1L

        notThrown()

    }
}
