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

package io.charlescd.villager.interactor.registry.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.ComponentTagListDTO;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInput;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInteractor;
import io.vertx.mutiny.redis.RedisClient;
import org.apache.http.HttpStatus;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class GetDockerRegistryTagInteractorImpl implements GetDockerRegistryTagInteractor {

    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;
    private RegistryClient registryClient;

    @Inject
    RedisClient redisClient;

    @Inject
    public GetDockerRegistryTagInteractorImpl(
            DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository,
            RegistryClient registryClient) {
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
        this.registryClient = registryClient;
    }

    @Override
    public Optional execute(GetDockerRegistryTagInput input) {

        var entity =
                this.dockerRegistryConfigurationRepository.findById(input.getArtifactRepositoryConfigurationId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY));

        if (!entity.workspaceId.equals(input.getWorkspaceId())) {
            throw new IllegalAccessResourceException(
                    "This docker registry does not belongs to the request application id.");
        }

        try {
            this.registryClient.configureAuthentication(entity.type, entity.connectionData, input.getArtifactName());


            Optional<Response> response;


            var isTagSearch = input.getName() != null && !input.getName().isEmpty();

            if (isTagSearch)
                response = this.registryClient.getImage(input.getArtifactName(), input.getName(), entity.connectionData);
            else {
                response = this.registryClient.getImagesTags(input.getArtifactName(), entity.connectionData);
            }

            if (response.isEmpty() || response.get().getStatus() != HttpStatus.SC_OK) {
                return Optional.empty();
            }

            if (isTagSearch) {
                return Optional.of(new ComponentTagDTO(
                        input.getName(),
                        entity.connectionData.host + "/" + input.getArtifactName() + ":" + input.getName()
                ));
            } else {
                var jsonEntity = response.get().readEntity(String.class);
                List<ComponentTagDTO> returnList = new ArrayList<>();
                ObjectMapper mapper = new ObjectMapper();

                var componetTagList = mapper.readValue(jsonEntity, ComponentTagListDTO.class);

                componetTagList.getTags().forEach(tag ->
                        returnList.add(new ComponentTagDTO(tag,
                                entity.connectionData.host + "/" + input.getArtifactName() + ":" + tag))
                );

                return Optional.of(returnList);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } finally {
            this.registryClient.closeQuietly();
        }
        return Optional.empty();
    }
}
