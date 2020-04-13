/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.registry.impl;

import br.com.zup.charlescd.villager.exceptions.IllegalAccessResourceException;
import br.com.zup.charlescd.villager.exceptions.ResourceNotFoundException;
import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import br.com.zup.charlescd.villager.infrastructure.integration.registry.TagsResponse;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import br.com.zup.charlescd.villager.interactor.registry.ComponentTagDTO;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryTagsInput;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryTagsInteractor;
import org.apache.commons.lang3.StringUtils;
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

        if(!entity.applicationId.equals(input.getApplicationId())) {
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
