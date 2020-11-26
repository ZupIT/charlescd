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

import com.fasterxml.jackson.databind.ObjectMapper;
import io.charlescd.villager.api.resources.registry.ComponentTagRepresentation;
import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.integration.registry.TagsResponse;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.ComponentTagListDTO;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInput;
import io.charlescd.villager.interactor.registry.impl.GetDockerRegistryTagInteractorImpl;
import io.charlescd.villager.service.DockerRegistryCacheService;
import org.jboss.resteasy.core.ServerResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

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

    @Mock
    private DockerRegistryCacheService dockerRegistryCacheService;

    @Test
    public void testContainsWithRedisCacheTag() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        var componentTagListDTO = generateReturnComponentTagListDTO();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(dockerRegistryCacheService.isExistingKey("1a3d413d-2255-4a1b-94ba-82e7366e4342")).thenReturn(true);

        when(dockerRegistryCacheService.get("1a3d413d-2255-4a1b-94ba-82e7366e4342")).thenReturn(componentTagListDTO);

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient, dockerRegistryCacheService);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        List<ComponentTagDTO> component = (List<ComponentTagDTO>) interactor.execute(input).get();

        assertThat(component.get(0).getName(), is("test - 1"));
        assertThat(component.get(0).getArtifact(), is("test.org/name:test - 1"));

        verify(registryClient, times(1))
                .configureAuthentication(entity.type, entity.connectionData, input.getArtifactName());

        verify(dockerRegistryCacheService, times(1))
                .isExistingKey("1a3d413d-2255-4a1b-94ba-82e7366e4342");

        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testContainsWithoutRedisCacheTag() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        var componentTagListDTO = generateReturnComponentTagListDTO();

        AtomicReference<ServerResponse> response = new AtomicReference<>(new ServerResponse());

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(dockerRegistryCacheService.isExistingKey("1a3d413d-2255-4a1b-94ba-82e7366e4342")).thenReturn(false);

        when(dockerRegistryCacheService.get("1a3d413d-2255-4a1b-94ba-82e7366e4342")).thenReturn(componentTagListDTO);

        doNothing().when(dockerRegistryCacheService).set(any(), any());

        doNothing().when(dockerRegistryCacheService).delete("1a3d413d-2255-4a1b-94ba-82e7366e4342");

        when(registryClient.getImagesTags("name",  entity.connectionData)).then(invocationOnMock -> {

            var tagsResponse = new TagsResponse();

            tagsResponse.setName("test");
            var tags = new ArrayList<String>();
            tags.add("test - 1");
            tags.add("test - 2");
            tagsResponse.setTags(tags);

            assertThat(tagsResponse.getName(), is("test"));
            assertThat(tagsResponse.getTags(), is(tags));

            ObjectMapper mapper = new ObjectMapper();
            return Optional.of(buildMockResponse(mapper.writeValueAsString(tagsResponse)));
        });

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient, dockerRegistryCacheService);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        var componentTagList = new ArrayList<ComponentTagRepresentation>();
        var finalResponse = interactor.execute(input);

        finalResponse.ifPresent(componentTagDTO -> {
            componentTagList.addAll(ComponentTagRepresentation.toListRepresentation((List<ComponentTagDTO>) componentTagDTO));
        });

        assertThat(componentTagList.get(0).getName(), is("test - 1"));
        assertThat(componentTagList.get(0).getArtifact(), is("test.org/name:test - 1"));
        verify(registryClient, times(1))
                .configureAuthentication(entity.type, entity.connectionData, input.getArtifactName());

        verify(registryClient, times(1))
                .getImagesTags("name", entity.connectionData);

        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testArtifactFoundButContainsNoTagsWithCache() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        var componentTagListDTO = generateReturnEmptyComponentTagListDTO();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        when(dockerRegistryCacheService.isExistingKey("1a3d413d-2255-4a1b-94ba-82e7366e4342")).thenReturn(true);

        when(dockerRegistryCacheService.get("1a3d413d-2255-4a1b-94ba-82e7366e4342")).thenReturn(componentTagListDTO);

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient, dockerRegistryCacheService);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("1a3d413d-2255-4a1b-94ba-82e7366e4342")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        assertTrue(((ArrayList)interactor.execute(input).get()).isEmpty());

    }

    @Test
    public void testDockerRegistryForbidden() throws IOException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.of(entity));

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient, dockerRegistryCacheService);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("123")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        Exception exception = assertThrows(IllegalAccessResourceException.class, () -> {
            ComponentTagDTO component = (ComponentTagDTO) interactor.execute(input).get();
        });

        assertThat(exception.getMessage(), is("This docker registry does not belongs to the request application id."));
        verify(registryClient, times(0))
                .configureAuthentication(entity.type, entity.connectionData, input.getArtifactName());
        verify(registryClient, times(0))
                .getImagesTags("name", entity.connectionData);
        verify(dockerRegistryConfigurationRepository, times(1)).findById("123");

    }

    @Test
    public void testDockerRegistryNotFound() throws ResourceNotFoundException {

        var entity = generateDockerRegistryConfigurationEntity();

        when(dockerRegistryConfigurationRepository.findById("123")).thenReturn(Optional.empty());

        var interactor =
                new GetDockerRegistryTagInteractorImpl(dockerRegistryConfigurationRepository, registryClient, dockerRegistryCacheService);

        GetDockerRegistryTagInput input = GetDockerRegistryTagInput.builder()
                .withArtifactName("name")
                .withWorkspaceId("123")
                .withArtifactRepositoryConfigurationId("123")
                .withName("test")
                .build();

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            ComponentTagDTO component = (ComponentTagDTO) interactor.execute(input).get();
        });

        assertThat(exception.getMessage(), is("Resource DOCKER_REGISTRY not found"));
        verify(registryClient, times(0))
                .configureAuthentication(entity.type, entity.connectionData, input.getArtifactName());
        verify(registryClient, times(0))
                .getImagesTags("name", entity.connectionData);
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

    private ComponentTagListDTO generateReturnComponentTagListDTO() {
        var componentTagListDTO = new ComponentTagListDTO();
        componentTagListDTO.setName("test");
        componentTagListDTO.setTags(new ArrayList<>());
        componentTagListDTO.getTags().add("test - 1");
        componentTagListDTO.getTags().add("test - 2");

        return componentTagListDTO;
    }

    private ComponentTagListDTO generateReturnEmptyComponentTagListDTO() {
        var componentTagListDTO = new ComponentTagListDTO();
        componentTagListDTO.setName("test");
        componentTagListDTO.setTags(new ArrayList<>());

        return componentTagListDTO;
    }

    private Response buildMockResponse(String msgEntity) {
        Response mockResponse = mock(Response.class);
        Mockito.when(mockResponse.readEntity(String.class)).thenReturn(msgEntity);
        return mockResponse;
    }
}
