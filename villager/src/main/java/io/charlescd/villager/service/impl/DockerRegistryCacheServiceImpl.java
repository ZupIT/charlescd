package io.charlescd.villager.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.charlescd.villager.interactor.registry.ComponentTagListDTO;
import io.charlescd.villager.service.DockerRegistryCacheService;
import io.quarkus.redis.client.RedisClient;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.Arrays;


@Singleton
public class DockerRegistryCacheServiceImpl implements DockerRegistryCacheService {

    @Inject
    private RedisClient redisClient;

    @ConfigProperty(name = "redis.key.expire.timeout", defaultValue = "300")
    private String expireTimeout;

    @Override
    public void delete(String key) {
        redisClient.del(Arrays.asList(key));
    }

    @Override
    public ComponentTagListDTO get(String key) throws JsonProcessingException {
        ComponentTagListDTO result;
        String jsonValue;
        try {
            jsonValue = redisClient.get(key).toString();
        } catch (NullPointerException e) {
            return null;
        }
        ObjectMapper mapper = new ObjectMapper();
        result = mapper.readValue(jsonValue, ComponentTagListDTO.class);
        return result;
    }

    @Override
    public void set(String key, String value) {
        redisClient.set(Arrays.asList(key, value));
        redisClient.expire(key, expireTimeout);
    }

    @Override
    public boolean isExistingKey(String key) {
            return redisClient
                    .keys(key)
                    .stream()
                    .count() > 0;
    }
}
