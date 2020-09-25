package io.charlescd.circlematcher.infrastructure

import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.StringRedisSerializer
import spock.lang.Specification

class RedisClientConfigurationTest extends Specification {
    def redisConnectionFactory = Mock(RedisConnectionFactory)
    def "should create the correct redis template"() {
        given:
        def clientCofiguration = new RedisClientConfiguration()
        when:
        def template = clientCofiguration.createTemplate(redisConnectionFactory);
        then:
        assert template.getHashKeySerializer() != null
        assert template.getHashKeySerializer() instanceof StringRedisSerializer
        assert template.getValueSerializer() != null
        assert template.getValueSerializer() instanceof Jackson2JsonRedisSerializer

    }

}

