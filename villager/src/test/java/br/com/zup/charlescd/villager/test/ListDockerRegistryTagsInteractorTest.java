/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.test;

import br.com.zup.charlescd.villager.exceptions.IllegalAccessResourceException;
import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;
import br.com.zup.charlescd.villager.infrastructure.integration.registry.TagsResponse;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import br.com.zup.charlescd.villager.interactor.registry.ComponentTagDTO;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryTagsInput;
import br.com.zup.charlescd.villager.interactor.registry.impl.ListDockerRegistryTagsInteractorImpl;
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
                .withApplicationId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
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
                .withApplicationId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
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
                .withApplicationId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
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
                .withApplicationId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
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
                .withApplicationId("123")
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
        entity.applicationId = "1a3d413d-2255-4a1b-94ba-82e7366e4342";
        entity.createdAt = LocalDateTime.now();
        entity.connectionData = new DockerRegistryConfigurationEntity
                .AzureDockerRegistryConnectionData("http://test.org", "usertest", "userpass");

        return entity;
    }


}
