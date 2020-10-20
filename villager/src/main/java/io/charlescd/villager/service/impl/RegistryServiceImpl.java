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
package io.charlescd.villager.service.impl;

import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.IntegrationException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.*;
import io.charlescd.villager.service.RegistryService;
import org.apache.http.HttpStatus;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import java.util.Objects;
import java.util.Optional;

@ApplicationScoped
public class RegistryServiceImpl implements RegistryService {

    private static final String ARTIFACT_NAME = "charles_cd";
    private static final String NAME = "test";

    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;
    private RegistryClient registryClient;

    @Inject
    public RegistryServiceImpl(
            DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository,
            RegistryClient registryClient) {
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
        this.registryClient = registryClient;
    }

    public DockerRegistryConfigurationEntity getDockerRegistryConfigurationEntity(String workspaceId, String artifactRepositoryConfigurationId) {
        var entity =
                this.dockerRegistryConfigurationRepository.findById(artifactRepositoryConfigurationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY));

        if (!entity.workspaceId.equals(workspaceId)) {
            throw new IllegalAccessResourceException(
                    "This docker registry does not belongs to the request application id.");
        }

        return entity;
    }

    public Optional<Response> getDockerRegistryTag(DockerRegistryConfigurationEntity entity, String artifactName, String name) {
        try {
            this.registryClient.configureAuthentication(entity.type, entity.connectionData, artifactName);

            return this.registryClient.getImage(artifactName, name, entity.connectionData);
        } finally           {
            this.registryClient.closeQuietly();
        }
    }

    public void testRegistryConnectivityConfig(DockerRegistryConfigurationEntity entity) {

        var response =
                getDockerRegistryTag(entity, ARTIFACT_NAME, NAME);

        validateResponse(entity.type, response);
    }

    public DockerRegistryConfigurationEntity fromDockerRegistryConfigurationInput(DockerRegistryConfigurationInput input) {
        var entity = new DockerRegistryConfigurationEntity();
        entity.name = input.getName();
        entity.type = input.getRegistryType();
        entity.workspaceId = input.getWorkspaceId();
        entity.authorId = input.getAuthorId();
        entity.connectionData = convertToConnectionData(input);
        return entity;
    }

    private DockerRegistryConfigurationEntity.DockerRegistryConnectionData convertToConnectionData(
            DockerRegistryConfigurationInput input) {
        DockerRegistryConfigurationEntity.DockerRegistryConnectionData connectionData;
        switch (input.getRegistryType()) {
            case AWS:
                var awsRegistryAuth = ((AWSDockerRegistryAuth) input.getAuth());
                connectionData =
                        new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(
                                input.getAddress(),
                                awsRegistryAuth.getAccessKey(),
                                awsRegistryAuth.getSecretKey(),
                                awsRegistryAuth.getRegion());
                break;
            case AZURE:
                var azureRegistryAuth = ((AzureDockerRegistryAuth) input.getAuth());
                connectionData =
                        new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData(
                                input.getAddress(),
                                azureRegistryAuth.getUsername(),
                                azureRegistryAuth.getPassword());
                break;
            case GCP:
                var gcpRegistryAuth = ((GCPDockerRegistryAuth) input.getAuth());
                connectionData =
                        new DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData(
                                input.getAddress(),
                                gcpRegistryAuth.getOrganization(),
                                gcpRegistryAuth.getUsername(),
                                gcpRegistryAuth.getJsonKey());
                break;
            case DOCKER_HUB:
                var dockerHubRegistryAuth = ((DockerHubDockerRegistryAuth) input.getAuth());
                connectionData =
                        new DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData(
                                input.getAddress(),
                                dockerHubRegistryAuth.getOrganization(),
                                dockerHubRegistryAuth.getUsername(),
                                dockerHubRegistryAuth.getPassword());
                break;
            default:
                throw new IllegalStateException("Registry type not supported!");
        }
        return connectionData;
    }

    private void validateResponse(RegistryType type, Optional<Response> response) {
        switch (type) {
            case AWS:
                //TODO: Implement
                break;
            case GCP:
                validateGCPResponse(response);
                break;
            case AZURE:
                //TODO: Implement
                break;
            case DOCKER_HUB:
                //TODO: Implement
                break;
            default:
                throw new IllegalStateException("Registry type not supported!");

        }
    }

    private void validateGCPResponse(Optional<Response> response) {
        if(Objects.nonNull(response)) {
            if (response.get().getStatus() == HttpStatus.SC_UNAUTHORIZED || response.get().getStatus() == HttpStatus.SC_FORBIDDEN) {
                throw new IllegalArgumentException("Invalid registry config");
            }

            if(!isSuccessfullyHttpStatus(response.get().getStatus()) && response.get().getStatus() != HttpStatus.SC_NOT_FOUND) {
                throw new IntegrationException("GCP integration error: " + response.get().getStatusInfo().getReasonPhrase());
            }
        }
    }

    private Boolean isSuccessfullyHttpStatus(int code) {
        return Response.Status.Family.familyOf(code) == Response.Status.Family.SUCCESSFUL;
    }
}
