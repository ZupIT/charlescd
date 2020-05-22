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

import io.charlescd.villager.api.resources.registry.ComponentRequestPart;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.*;
import io.charlescd.villager.interactor.build.CreateBuildInput;
import io.charlescd.villager.interactor.build.NewBuildDTO;
import io.charlescd.villager.interactor.build.impl.CreateBuildInteractorImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CreateBuildInteractorTest {

    @Mock
    private BuildRepository buildRepository;
    @Mock
    private ComponentRepository componentRepository;
    @Mock
    private ModuleRepository moduleRepository;
    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Captor
    private ArgumentCaptor<BuildEntity> buildEntityArgumentCaptor;

    @Captor
    private ArgumentCaptor<ModuleEntity> moduleEntityArgumentCaptor;

    @Captor
    private ArgumentCaptor<Stream<ComponentEntity>> componentEntityArgumentCaptor;

    @Test
    public void testCreateBuildWithSuccess() {

        // Mock
        var buildId = UUID.randomUUID().toString();
        var module1Id = "9fab86f4-a0c3-45dd-8211-86f31dd4f1c8";
        var module2Id = "5d3d4878-9be4-49eb-b98c-e5e2169325e4";
        var registryConfigurationId = "5318049c-866a-4a02-ad14-e651135c596d";
        var circleId = "0947b021-71f8-4dff-b133-6f2bbc9822eb";
        var callbackUrl = "http://callback.org";

        doAnswer(invocation -> {
            var arg0 = (BuildEntity) invocation.getArgument(0);
            arg0.id = buildId;
            return null;
        }).when(buildRepository).persist(any(BuildEntity.class));

        doAnswer(invocation -> {
            var arg0 = (ModuleEntity) invocation.getArgument(0);
            arg0.id = UUID.randomUUID().toString();
            return null;
        }).when(moduleRepository).persist(any(ModuleEntity.class));

        when(dockerRegistryConfigurationRepository.findById(registryConfigurationId)).thenReturn(generateDockerRegistryConfigurationEntity(registryConfigurationId));

        // Call
        var useCase = new CreateBuildInteractorImpl(buildRepository, componentRepository, moduleRepository, dockerRegistryConfigurationRepository);

        var module1ComponentsPartSet = new LinkedHashSet<ComponentRequestPart>();
        module1ComponentsPartSet.add(new ComponentRequestPart("tag_1", "component_1"));

        var module2ComponentsPartSet = new LinkedHashSet<ComponentRequestPart>();
        module2ComponentsPartSet.add(new ComponentRequestPart("tag_2", "component_2"));

        var input = CreateBuildInput.builder()
                .withTagName("tag_1")
                .withModule(module1Id, "module_1", registryConfigurationId, module1ComponentsPartSet)
                .withModule(module2Id, "module_2", registryConfigurationId, module2ComponentsPartSet)
                .withCallbackUrl(callbackUrl)
                .build();

        NewBuildDTO newBuild = useCase.execute(input, circleId);

        // Check
        assertThat(newBuild, notNullValue());
        assertThat(newBuild.getId(), is(buildId));

        verify(buildRepository, times(1)).persist(buildEntityArgumentCaptor.capture());
        var buildEntityArgumentCaptorValue = buildEntityArgumentCaptor.getValue();
        assertThat(buildEntityArgumentCaptorValue.id, is(buildId));
        assertThat(buildEntityArgumentCaptorValue.tagName, is("tag_1"));
        assertThat(buildEntityArgumentCaptorValue.circleId, is(circleId));
        assertThat(buildEntityArgumentCaptorValue.createdAt, notNullValue());
        assertThat(buildEntityArgumentCaptorValue.callbackUrl, is(callbackUrl));
        assertThat(buildEntityArgumentCaptorValue.status, is(BuildStatus.CREATED));
        assertThat(buildEntityArgumentCaptorValue.callbackStatus, nullValue());

        verify(moduleRepository, times(2)).persist(moduleEntityArgumentCaptor.capture());
        var moduleEntityArgumentCaptorValue = moduleEntityArgumentCaptor.getAllValues();
        var module1EntityId = moduleEntityArgumentCaptorValue.get(0).id;
        assertThat(module1EntityId, notNullValue());
        assertThat(moduleEntityArgumentCaptorValue.get(0).externalId, is(module1Id));
        assertThat(moduleEntityArgumentCaptorValue.get(0).name, is("module_1"));
        assertThat(moduleEntityArgumentCaptorValue.get(0).tagName, is("tag_1"));
        assertThat(moduleEntityArgumentCaptorValue.get(0).status, is(ModuleBuildStatus.CREATED));
        assertThat(moduleEntityArgumentCaptorValue.get(0).buildEntityId, is(buildId));
        assertThat(moduleEntityArgumentCaptorValue.get(0).registryConfigurationId, is(registryConfigurationId));
        assertThat(moduleEntityArgumentCaptorValue.get(0).registry, is("test.org"));

        var module2EntityId = moduleEntityArgumentCaptorValue.get(1).id;
        assertThat(module2EntityId, notNullValue());
        assertThat(moduleEntityArgumentCaptorValue.get(1).externalId, is(module2Id));
        assertThat(moduleEntityArgumentCaptorValue.get(1).name, is("module_2"));
        assertThat(moduleEntityArgumentCaptorValue.get(1).tagName, is("tag_1"));
        assertThat(moduleEntityArgumentCaptorValue.get(1).status, is(ModuleBuildStatus.CREATED));
        assertThat(moduleEntityArgumentCaptorValue.get(1).buildEntityId, is(buildId));
        assertThat(moduleEntityArgumentCaptorValue.get(1).registryConfigurationId, is(registryConfigurationId));
        assertThat(moduleEntityArgumentCaptorValue.get(1).registry, is("test.org"));

        verify(componentRepository, times(2)).persist(componentEntityArgumentCaptor.capture());
        var componentEntityArgumentCaptorValue = componentEntityArgumentCaptor.getAllValues();
        var component1 = componentEntityArgumentCaptorValue.get(0).findFirst().get();
        assertThat(component1.id, notNullValue());
        assertThat(component1.name, is("component_1"));
        assertThat(component1.tagName, is("tag_1"));
        assertThat(component1.moduleEntityId, is(module1EntityId));

        var component2 = componentEntityArgumentCaptorValue.get(1).findFirst().get();
        assertThat(component2.id, notNullValue());
        assertThat(component2.name, is("component_2"));
        assertThat(component2.tagName, is("tag_2"));
        assertThat(component2.moduleEntityId, is(module2EntityId));

        verify(dockerRegistryConfigurationRepository, times(2)).findById(registryConfigurationId);

    }

    @Test
    public void testCreateBuildWithError() {

        // Mock
        var buildId = UUID.randomUUID().toString();
        var module1Id = "9fab86f4-a0c3-45dd-8211-86f31dd4f1c8";
        var module2Id = "5d3d4878-9be4-49eb-b98c-e5e2169325e4";
        var registryConfigurationId = "5318049c-866a-4a02-ad14-e651135c596d";
        var circleId = "0947b021-71f8-4dff-b133-6f2bbc9822eb";
        var callbackUrl = "http://callback.org";

        doAnswer(invocation -> {
            var arg0 = (BuildEntity) invocation.getArgument(0);
            arg0.id = buildId;
            return null;
        }).when(buildRepository).persist(any(BuildEntity.class));

        doThrow(new RuntimeException("Testing")).when(moduleRepository).persist(any(ModuleEntity.class));

        when(dockerRegistryConfigurationRepository.findById(registryConfigurationId)).thenReturn(generateDockerRegistryConfigurationEntity(registryConfigurationId));

        // Call
        var useCase = new CreateBuildInteractorImpl(buildRepository, componentRepository, moduleRepository, dockerRegistryConfigurationRepository);

        var module1ComponentsPartSet = new LinkedHashSet<ComponentRequestPart>();
        module1ComponentsPartSet.add(new ComponentRequestPart("tag_1", "component_1"));

        var module2ComponentsPartSet = new LinkedHashSet<ComponentRequestPart>();
        module2ComponentsPartSet.add(new ComponentRequestPart("tag_2", "component_2"));

        var input = CreateBuildInput.builder()
                .withTagName("tag_1")
                .withModule(module1Id, "module_1", registryConfigurationId, module1ComponentsPartSet)
                .withModule(module2Id, "module_2", registryConfigurationId, module2ComponentsPartSet)
                .withCallbackUrl(callbackUrl)
                .build();

        Exception exception = assertThrows(RuntimeException.class, () -> {
            useCase.execute(input, circleId);
        });

        // Check
        assertThat(exception, notNullValue());
        assertThat(exception.getMessage(), is("Build request creation failure"));

        verify(buildRepository, times(2)).persist(buildEntityArgumentCaptor.capture());
        var buildEntityArgumentCaptorValue = buildEntityArgumentCaptor.getValue();
        assertThat(buildEntityArgumentCaptorValue.id, is(buildId));
        assertThat(buildEntityArgumentCaptorValue.tagName, is("tag_1"));
        assertThat(buildEntityArgumentCaptorValue.circleId, is(circleId));
        assertThat(buildEntityArgumentCaptorValue.createdAt, notNullValue());
        assertThat(buildEntityArgumentCaptorValue.finishedAt, notNullValue());
        assertThat(buildEntityArgumentCaptorValue.callbackUrl, is(callbackUrl));
        assertThat(buildEntityArgumentCaptorValue.status, is(BuildStatus.CREATION_FAILURE));
        assertThat(buildEntityArgumentCaptorValue.callbackStatus, nullValue());

        verify(moduleRepository, times(1)).persist(any(ModuleEntity.class));

        verify(componentRepository, times(0)).persist(any(ComponentEntity.class));

        verify(dockerRegistryConfigurationRepository, times(1)).findById(registryConfigurationId);

    }

    private Optional<DockerRegistryConfigurationEntity> generateDockerRegistryConfigurationEntity(String id) {
        var entity = new DockerRegistryConfigurationEntity();
        entity.id = id;
        entity.name = "Testing";
        entity.type = RegistryType.AZURE;
        entity.createdAt = LocalDateTime.now();
        entity.connectionData = new DockerRegistryConfigurationEntity
                .AzureDockerRegistryConnectionData("http://test.org", "usertest", "userpass");

        return Optional.of(entity);
    }

}
