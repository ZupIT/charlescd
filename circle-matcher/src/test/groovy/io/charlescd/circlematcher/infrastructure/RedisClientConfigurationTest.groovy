package io.charlescd.circlematcher.infrastructure

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.StringRedisSerializer
import spock.lang.Specification

class RedisClientConfigurationTest extends Specification {

    def "should create the correct redis template"() {
        given:
        def template = new RedisTemplate<String, Object>();
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer =  new Jackson2JsonRedisSerializer<>(Object.class);
        jackson2JsonRedisSerializer.setObjectMapper(objectMapper);
        when:
        template.setHashKeySerializer(jackson2JsonRedisSerializer);
        then:
        assert template.getHashKeySerializer() != null
        assert template.getHashKeySerializer() instanceof Jackson2JsonRedisSerializer

    }

}

