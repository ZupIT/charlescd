package io.charlescd.villager.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.charlescd.villager.interactor.registry.ComponentTagListDTO;
import io.charlescd.villager.service.DockerRegistryService;
import io.quarkus.redis.client.RedisClient;
import io.quarkus.redis.client.reactive.ReactiveRedisClient;
import io.smallrye.mutiny.Uni;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.Arrays;


@Singleton
public class DockerRegistryServiceImpl implements DockerRegistryService {

    @Inject
    RedisClient redisClient;

    @Inject
    ReactiveRedisClient reactiveRedisClient;


    @Override
    public Uni<Void> delete(String key) {
        return reactiveRedisClient.del(Arrays.asList(key))
                .map(response -> null);
    }

    @Override
    public ComponentTagListDTO get(String key) throws JsonProcessingException {
        ComponentTagListDTO result;
        String jsonValue;
        try {
             jsonValue = redisClient.get(key).toString();
        } catch (NullPointerException e){
            return null;
        }
        ObjectMapper mapper = new ObjectMapper();
        result = mapper.readValue(jsonValue, ComponentTagListDTO.class);
        return result ;
    }

    @Override
    public void set(String key, String value) {
        redisClient.set(Arrays.asList(key, value));
    }

}
