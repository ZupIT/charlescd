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
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInput;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInteractor;
import java.util.Optional;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class GetDockerRegistryTagInteractorImpl implements GetDockerRegistryTagInteractor {

    private static final Logger LOGGER = LoggerFactory.getLogger(GetDockerRegistryTagInteractorImpl.class);

    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;
    private RegistryClient registryClient;

    @Inject
    public GetDockerRegistryTagInteractorImpl(
            DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository,
            RegistryClient registryClient) {
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
        this.registryClient = registryClient;
    }

    @Override
    public Optional<ComponentTagDTO> execute(GetDockerRegistryTagInput input) {

        var optionalEntity =
                this.dockerRegistryConfigurationRepository.findById(input.getArtifactRepositoryConfigurationId());
        var entity = optionalEntity
                .orElseThrow(
                        () -> new ResourceNotFoundException(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY));

        if (!entity.workspaceId.equals(input.getWorkspaceId())) {
            throw new IllegalAccessResourceException(
                    "This docker registry does not belongs to the request application id.");
        }

        this.registryClient.configureAuthentication(entity.type, entity.connectionData);

        var response = this.registryClient.getImage(input.getArtifactName(), input.getName());

        if (response.isEmpty() || response.get().getStatus() != HttpStatus.SC_OK) {
            return Optional.empty();
        }

        return Optional.of(new ComponentTagDTO(
                input.getName(),
                entity.connectionData.host + "/" + input.getArtifactName() + ":" + input.getName()
        ));
    }
}
