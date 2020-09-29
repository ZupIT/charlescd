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

package io.charlescd.villager.test;

import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.integration.registry.TagsResponse;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInput;
import io.charlescd.villager.interactor.registry.impl.GetDockerRegistryTagInteractorImpl;
import org.jboss.resteasy.core.Headers;
import org.jboss.resteasy.core.ServerResponse;
import org.jboss.resteasy.specimpl.BuiltResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.lang.annotation.Annotation;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GetDockerRegistryTagInteractorTest {

    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Mock
    private RegistryClient registryClient;

    @Test
    public void testContainsTag() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(registryClient.getImage("name", "test", entity.connectionData)).then(invocationOnMock -> {

            var tagsResponse = new TagsResponse();
            Annotation[] annotations = new Annotation[1];

            tagsResponse.setName("name");
            var tags = new ArrayList<String>();
            tags.add("tag_1");
            tags.add("tag_2");
            tagsResponse.setTags(tags);

            var builtResponse = new BuiltResponse(200, new Headers<>(), tagsResponse, annotations);
            var response = new ServerResponse(builtResponse);

            return Optional.of(response);

        });

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        ComponentTagDTO component = interactor.execute(input).get();

        assertThat(component.getName(), is("test"));
        assertThat(component.getArtifact(), is("test.org/name:test"));
        verify(registryClient, times(1)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(1)).getImage("name", "test", entity.connectionData);
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testArtifactFoundButContainsNoTags() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(registryClient.getImage("name", "test", entity.connectionData)).then(invocationOnMock -> Optional.empty());

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        assertTrue(interactor.execute(input).isEmpty());
        verify(registryClient, times(1)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(1)).getImage("name", "test", entity.connectionData);
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");
    }

    @Test
    public void testDockerRegistryForbidden() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("123")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        Exception exception = assertThrows(IllegalAccessResourceException.class, () -> {
            ComponentTagDTO component = interactor.execute(input).get();
        });

        assertThat(exception.getMessage(), is("This docker registry does not belongs to the request application id."));
        verify(registryClient, times(0)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(0)).getImage("name", "test", entity.connectionData);
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testDockerRegistryNotFound() throws ResourceNotFoundException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.empty());

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("123")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            ComponentTagDTO component = interactor.execute(input).get();
        });

        assertThat(exception.getMessage(), is("Resource DOCKER_REGISTRY not found"));
        verify(registryClient, times(0)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(0)).getImage("name", "test", entity.connectionData);
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    private DockerRegistryConfigurationEntity generateDockerRegistryConfigurationEntity() {
        var entity = new DockerRegistryConfigurationEntity();
        entity.id = "123";
        entity.name = "Testing";
        entity.type = RegistryType.AZURE;
        entity.workspaceId = "1a3d413d-2255-4a1b-94ba-82e7366e4342";
        entity.createdAt = LocalDateTime.now();
        entity.connectionData = new DockerRegistryConfigurationEntity
                .AzureDockerRegistryConnectionData("http://test.org", "usertest", "userpass");

        return entity;
    }
}
