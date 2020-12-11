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
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.integration.registry.TagsResponse;
import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.impl.GetDockerRegistryTagInteractorImpl;
import io.charlescd.villager.service.RegistryService;
import io.charlescd.villager.utils.DockerRegistryTestUtils;
import org.apache.http.HttpStatus;
import org.jboss.resteasy.core.Headers;
import org.jboss.resteasy.core.ServerResponse;
import org.jboss.resteasy.specimpl.BuiltResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.ws.rs.core.Response;
import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GetDockerRegistryTagInteractorTest {

    private static final String ARTIFACT_NAME = "charles_cd";
    private static final String ID_DEFAULT_VALUE = "1a3d413d-2255-4a1b-94ba-82e7366e4342";
    private static final String TAG_NAME = "test";

    @Mock
    private RegistryService registryService;

    @Test
    public void testContainsTag()  {

        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity( RegistryType.AZURE);
        var input = DockerRegistryTestUtils.generateDockerRegistryTagInput(ID_DEFAULT_VALUE);

        when(registryService.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE)).then(invocationOnMock -> entity);

        when(registryService.getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME)).then(invocationOnMock -> {

            var tagsResponse = new TagsResponse();
            Annotation[] annotations = new Annotation[1];

            tagsResponse.setName("name");
            var tags = new ArrayList<String>();
            tags.add("tag_1");
            tags.add("tag_2");
            tagsResponse.setTags(tags);

            assertThat(tagsResponse.getName(), is("name"));
            assertThat(tagsResponse.getTags(), is(tags));

            var builtResponse = new BuiltResponse(200, new Headers<>(), tagsResponse, annotations);
            var response = new ServerResponse(builtResponse);

            return Optional.of(response);

        });

        var interactor =
                new GetDockerRegistryTagInteractorImpl(registryService);

        ComponentTagDTO component = interactor.execute(input).get();

        assertThat(component.getName(), is("test"));
        assertThat(component.getArtifact(), is("registry.io.com/charles_cd:test"));
        verify(registryService, times(1))
                .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        verify(registryService, times(1))
                .getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME);

    }

    @Test
    public void testArtifactFoundButContainsNoTags() {

        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.AZURE);
        var input = DockerRegistryTestUtils.generateDockerRegistryTagInput(ID_DEFAULT_VALUE);

        when(registryService.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE)).then(invocationOnMock -> entity);

        var interactor =
                new GetDockerRegistryTagInteractorImpl(registryService);

        assertTrue(interactor.execute(input).isEmpty());

        verify(registryService, times(1))
                .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        verify(registryService, times(1))
                .getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME);
    }

    @Test
    public void testArtifactFoundButErrorHappensGettingTags() {

        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.AZURE);
        var input = DockerRegistryTestUtils.generateDockerRegistryTagInput(ID_DEFAULT_VALUE);

        when(registryService.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE)).then(invocationOnMock -> entity);
        when(registryService.getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME))
                .thenReturn(Optional.of(Response.status(HttpStatus.SC_CONFLICT).build()));

        var interactor =
                new GetDockerRegistryTagInteractorImpl(registryService);

        assertTrue(interactor.execute(input).isEmpty());

        verify(registryService, times(1))
                .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        verify(registryService, times(1))
                .getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME);
    }


    @Test
    public void testDockerRegistryForbiddenWorkspace()  {

        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.AZURE);
        entity.workspaceId = "123";

        var input = DockerRegistryTestUtils.generateDockerRegistryTagInput(ID_DEFAULT_VALUE);

        when(registryService.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE)).thenThrow(IllegalAccessResourceException.class);

        var interactor =
                new GetDockerRegistryTagInteractorImpl(registryService);

        Exception exception = assertThrows(IllegalAccessResourceException.class, () -> {
            interactor.execute(input);
        });

        verify(registryService, times(1))
                .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        verify(registryService, times(0))
                .getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME);

    }

    @Test
    public void testDockerRegistryNotFound() throws ResourceNotFoundException {

        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.AZURE);
        var input = DockerRegistryTestUtils.generateDockerRegistryTagInput(ID_DEFAULT_VALUE);

        when(registryService.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE)).thenThrow(ResourceNotFoundException.class);

        var interactor =
                new GetDockerRegistryTagInteractorImpl(registryService);


        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            ComponentTagDTO component = interactor.execute(input).get();
        });

        verify(registryService, times(1))
                .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        verify(registryService, times(0))
                .getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME);

    }
}
