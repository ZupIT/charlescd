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

import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.ListDockerRegistryTagsInput;
import io.charlescd.villager.interactor.registry.ListDockerRegistryTagsInteractor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ListDockerRegistryTagsInteractorImpl implements ListDockerRegistryTagsInteractor {

    private static final Logger LOGGER = LoggerFactory.getLogger(ListDockerRegistryTagsInteractorImpl.class);

    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;
    private RegistryClient registryClient;

    @Inject
    public ListDockerRegistryTagsInteractorImpl(DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository, RegistryClient registryClient) {
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
        this.registryClient = registryClient;
    }

    @Override
    public List<ComponentTagDTO> execute(ListDockerRegistryTagsInput input) {

        var optionalEntity = this.dockerRegistryConfigurationRepository.findById(input.getArtifactRepositoryConfigurationId());
        var entity = optionalEntity.orElseThrow(() -> new ResourceNotFoundException(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY));

        if(!entity.workspaceId.equals(input.getWorkspaceId())) {
            throw new IllegalAccessResourceException("This docker registry does not belongs to the request application id.");
        }

        this.registryClient.configureAuthentication(entity.type, entity.connectionData);

        try {
            var response = this.registryClient.listImageTags(input.getArtifactName(), input.getMax(), input.getLast());

            return response != null ? response.getTags().stream()
                    .map(tag -> new ComponentTagDTO(tag, entity.connectionData.host + "/" + input.getArtifactName() + ":" + tag))
                    .collect(Collectors.toList()) : Collections.emptyList();
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }
}
