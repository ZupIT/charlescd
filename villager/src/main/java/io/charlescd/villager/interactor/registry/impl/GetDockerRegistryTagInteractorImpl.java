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
import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.ComponentTagListDTO;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInput;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInteractor;
import io.charlescd.villager.service.DockerRegistryCacheService;
import java.util.Comparator;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;

@ApplicationScoped
public class GetDockerRegistryTagInteractorImpl implements GetDockerRegistryTagInteractor {

    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;
    private RegistryClient registryClient;
    private DockerRegistryCacheService registryService;

    @Inject
    public GetDockerRegistryTagInteractorImpl(
            DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository,
            RegistryClient registryClient,
            DockerRegistryCacheService registryService) {
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
        this.registryClient = registryClient;
        this.registryService = registryService;
    }

    @Override
    public Optional execute(GetDockerRegistryTagInput input) {

        var entity =
                this.dockerRegistryConfigurationRepository.findById(
                        input.getArtifactRepositoryConfigurationId()
                )
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY)
                        );

        if (!entity.workspaceId.equals(input.getWorkspaceId())) {
            throw new IllegalAccessResourceException(
                    "This docker registry does not belongs to the request application id.");
        }

        var cacheKey = entity.workspaceId;

        try {
            this.registryClient.configureAuthentication(entity.type, entity.connectionData, input.getArtifactName());
            var name = input.getName();
            if (name == null || name.isEmpty() || !registryService.isExistingKey(cacheKey)) {
                Optional<Response> response = this.registryClient.getImagesTags(
                        input.getArtifactName(),
                        entity.connectionData
                );
                var jsonEntity = response.get().readEntity(String.class);
                saveCacheList(entity.workspaceId, jsonEntity);
            }

            return cacheSearch(
                    entity.workspaceId,
                    name,
                    entity.connectionData.host,
                    input.getArtifactName()
            );

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } finally {
            this.registryClient.closeQuietly();
        }
        return Optional.empty();
    }

    private Optional cacheSearch(String key,
                                 String name,
                                 String host,
                                 String artifactName) throws JsonProcessingException {
        ComponentTagListDTO componetTagList = registryService.get(key);

        return Optional.of(componetTagList.getTags()
                .stream()
                .filter(tag -> tag.startsWith(name))
                .collect(Collectors.toList())
                .stream()
                .map(tag ->
                        new ComponentTagDTO(tag,
                                host + "/" + artifactName + ":" + tag)
                ).sorted(Comparator.comparing(ComponentTagDTO::getName)).collect(Collectors.toList()));
    }

    private void saveCacheList(String key, String jsonEntity) throws JsonProcessingException {
        ComponentTagListDTO tagList = registryService.get(key);
        if (tagList != null) {
            registryService.delete(key);
        }
        registryService.set(key, jsonEntity);
    }
}
