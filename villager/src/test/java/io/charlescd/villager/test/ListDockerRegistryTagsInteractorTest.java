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
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.integration.registry.TagsResponse;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.ListDockerRegistryTagsInput;
import io.charlescd.villager.interactor.registry.impl.ListDockerRegistryTagsInteractorImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ListDockerRegistryTagsInteractorTest {

    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Mock
    private RegistryClient registryClient;

    @Test
    public void testRegistryError() throws IOException {
        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));
        when(registryClient.listImageTags("name", 10, "test")).thenThrow(new IOException("Testing"));

        var interactor = new ListDockerRegistryTagsInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        ListDockerRegistryTagsInput input = ListDockerRegistryTagsInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withMax(10)
                .withLast("test")
                .build();

        Exception exception = assertThrows(RuntimeException.class, () -> {
            List<ComponentTagDTO> components = interactor.execute(input);
        });

        assertThat(exception.getMessage(), is("Testing"));
        verify(registryClient, times(1)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(1)).listImageTags("name", 10, "test");
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testContainsTags() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(registryClient.listImageTags("name", 10, "test")).then(invocationOnMock -> {

            var tagsResponse = new TagsResponse();

            tagsResponse.setName("name");
            var tags = new ArrayList<String>();
            tags.add("tag_1");
            tags.add("tag_2");
            tagsResponse.setTags(tags);

            return tagsResponse;

        });

        var interactor = new ListDockerRegistryTagsInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        ListDockerRegistryTagsInput input = ListDockerRegistryTagsInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withMax(10)
                .withLast("test")
                .build();

        List<ComponentTagDTO> components = interactor.execute(input);

        assertThat(components, hasItems());
        assertThat(components.get(0).getName(), is("tag_1"));
        assertThat(components.get(0).getArtifact(), is("test.org/name:tag_1"));
        assertThat(components.get(1).getName(), is("tag_2"));
        assertThat(components.get(1).getArtifact(), is("test.org/name:tag_2"));
        verify(registryClient, times(1)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(1)).listImageTags("name", 10, "test");
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testArtifactFoundButContainsNoTags() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(registryClient.listImageTags("name", 10, "test")).then(invocationOnMock -> {

            var tagsResponse = new TagsResponse();

            tagsResponse.setName("name");
            tagsResponse.setTags(Collections.emptyList());

            return tagsResponse;

        });

        var interactor = new ListDockerRegistryTagsInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        ListDockerRegistryTagsInput input = ListDockerRegistryTagsInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withMax(10)
                .withLast("test")
                .build();

        List<ComponentTagDTO> components = interactor.execute(input);

        assertThat(components, empty());
        verify(registryClient, times(1)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(1)).listImageTags("name", 10, "test");
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testArtifactNotFound() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(registryClient.listImageTags("name", 10, "test")).thenReturn(null);

        var interactor = new ListDockerRegistryTagsInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        ListDockerRegistryTagsInput input = ListDockerRegistryTagsInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withMax(10)
                .withLast("test")
                .build();

        List<ComponentTagDTO> components = interactor.execute(input);

        assertThat(components, empty());
        verify(registryClient, times(1)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(1)).listImageTags("name", 10, "test");
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testDockerRegistryForbidden() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        var interactor = new ListDockerRegistryTagsInteractorImpl(dockerRegistryConfigurationRepository, registryClient);

        ListDockerRegistryTagsInput input = ListDockerRegistryTagsInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("123")
                .withArtifactRepositoryConfigurationId("123")
                .withMax(10)
                .withLast("test")
                .build();

        Exception exception = assertThrows(IllegalAccessResourceException.class, () -> {
            List<ComponentTagDTO> components = interactor.execute(input);
        });

        assertThat(exception.getMessage(), is("This docker registry does not belongs to the request application id."));
        verify(registryClient, times(0)).configureAuthentication(entity.type, entity.connectionData);
        verify(registryClient, times(0)).listImageTags("name", 10, "test");
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
