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

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.BuildEntity;
import io.charlescd.villager.infrastructure.persistence.BuildRepository;
import io.charlescd.villager.infrastructure.persistence.BuildStatus;
import io.charlescd.villager.infrastructure.persistence.ComponentEntity;
import io.charlescd.villager.infrastructure.persistence.ComponentRepository;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.infrastructure.persistence.ModuleBuildStatus;
import io.charlescd.villager.infrastructure.persistence.ModuleEntity;
import io.charlescd.villager.infrastructure.persistence.ModuleRepository;
import io.charlescd.villager.interactor.build.impl.UpdateBuildInfoInteractorImpl;
import io.charlescd.villager.service.BuildNotificationService;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.ws.rs.core.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.exceptions.misusing.InvalidUseOfMatchersException;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UpdateBuildInfoInteractorTest {

    @Mock
    private BuildRepository buildRepository;
    @Mock
    private ModuleRepository moduleRepository;
    @Mock
    private ComponentRepository componentRepository;
    @Mock
    private BuildNotificationService buildNotificationService;
    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;
    @Mock
    private RegistryClient registryClient;
    @Captor
    private ArgumentCaptor<ModuleEntity> moduleEntityArgumentCaptor;
    @Captor
    private ArgumentCaptor<List<ModuleEntity>> listModuleEntityArgumentCaptor;
    @Captor
    private ArgumentCaptor<BuildEntity> buildEntityArgumentCaptor;

    @Test
    public void testNotifyBuildFinishedWithSuccess() {

        // Mock - Docker Registry Configuration
        var registryConfigurationId = "a69c3cfb-5587-448f-b011-beae9a4a3fbb";

        when(dockerRegistryConfigurationRepository.findById(registryConfigurationId)).then(invocationOnMock -> {
            var entity = new DockerRegistryConfigurationEntity();
            entity.id = "edce5d09-e7a2-4763-910e-41c003f68fb9";
            entity.type = RegistryType.AZURE;
            entity.name = "Docker Registry";
            entity.createdAt = LocalDateTime.now();
            entity.connectionData =
                    new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData("http://registry/test",
                            "usertest", "passtest");
            return Optional.of(entity);
        });

        // Mock - Builds
        BuildEntity build1 = BuildEntity.create("tag_1", "http://callback.org", "42780fcb-1a6a-442c-97a4-78ffb90a5dc7");
        build1.id = "189fa7e8-2985-46a1-8aad-72c768df3fcd";

        BuildEntity build2 = BuildEntity.create("tag_1", "http://callback.org", "42780fcb-1a6a-442c-97a4-78ffb90a5dc7");
        build2.id = "ecbb5bb9-f56e-45e6-abdf-d0676647e9ed";

        when(buildRepository.findById(anyString())).thenReturn(build1, build2);

        // Mock - Modules
        ModuleEntity module1 = ModuleEntity
                .create("4f94780e-ebe1-4d4c-8a97-e3b01997492a", "module_1", "tag_1", build1.id, registryConfigurationId,
                        "http://registry/test");
        module1.id = "274fead7-6334-4d58-9834-d1bfa57fd1ef";

        ModuleEntity module2 = ModuleEntity
                .create("5ffa9132-0569-4216-9037-824f9d0f2755", "module_2", "tag_2", build2.id, registryConfigurationId,
                        "http://registry/test");
        module2.id = "84066c5c-a6e9-4343-8713-1f0b864c92cb";

        mockModulesByStatus(module1, module2);

        var mockBuildModuleData = new HashMap<BuildEntity, List<ModuleEntity>>();
        mockBuildModuleData.put(build1, List.of(module1));
        mockBuildModuleData.put(build2, List.of(module2));

        mockModulesByBuild(mockBuildModuleData);

        // Mock - Components
        var componentEntity1 = ComponentEntity.create("module_1_component_1", "tag_1", module1.id);
        componentEntity1.id = "2dcd0966-526b-44d7-be00-db6dfc779ecf";
        var componentEntity2 = ComponentEntity.create("module_1_component_2", "tag_1", module1.id);
        componentEntity2.id = "1e873458-97f8-492b-9863-cc3ca71d7e23";
        var componentEntity3 = ComponentEntity.create("module_2_component_1", "tag_1", module2.id);
        componentEntity3.id = "6b3a665a-4cc3-4d34-8a84-ecc74989b8b3";
        var componentEntity4 = ComponentEntity.create("module_2_component_2", "tag_1", module2.id);
        componentEntity4.id = "a29910b5-47bf-483a-a873-ed86f3a6e88e";

        var mockModuleComponentData = new HashMap<ModuleEntity, List<ComponentEntity>>();
        mockModuleComponentData.put(module1, List.of(componentEntity1, componentEntity2));
        mockModuleComponentData.put(module2, List.of(componentEntity3, componentEntity4));

        mockComponentsByModule(mockModuleComponentData);

        // Mock - Registry Client
        doNothing().when(registryClient).configureAuthentication(eq(RegistryType.AZURE), any());
        when(registryClient.getImage(anyString(), anyString(), any())).thenReturn(Optional.of(Response.ok().build()));

        // Execute
        var interactor = new UpdateBuildInfoInteractorImpl(buildRepository, moduleRepository, componentRepository,
                buildNotificationService, dockerRegistryConfigurationRepository, registryClient, 10);
        interactor.execute();

        // Check
        verify(dockerRegistryConfigurationRepository, times(4)).findById(registryConfigurationId);

        verify(registryClient, times(8)).getImage(anyString(), anyString(), any());

        verify(componentRepository, times(1)).findByModuleId(module1.id);
        verify(componentRepository, times(1)).findByModuleId(module2.id);

        verify(buildNotificationService, times(2))
                .notify(buildEntityArgumentCaptor.capture(), listModuleEntityArgumentCaptor.capture());
        var buildEntityArgumentCaptorValues = buildEntityArgumentCaptor.getAllValues();
        assertThat(buildEntityArgumentCaptorValues.get(0).id, is(build1.id));
        assertThat(buildEntityArgumentCaptorValues.get(0).status, is(BuildStatus.SUCCESS));
        assertThat(buildEntityArgumentCaptorValues.get(0).finishedAt, notNullValue());
        assertThat(buildEntityArgumentCaptorValues.get(1).id, is(build2.id));
        assertThat(buildEntityArgumentCaptorValues.get(1).status, is(BuildStatus.SUCCESS));
        assertThat(buildEntityArgumentCaptorValues.get(1).finishedAt, notNullValue());
        var listModuleEntityArgumentCaptorValues = listModuleEntityArgumentCaptor.getAllValues();
        assertThat(listModuleEntityArgumentCaptorValues.get(0).get(0).id, is(module1.id));
        assertThat(listModuleEntityArgumentCaptorValues.get(0).get(0).status, is(ModuleBuildStatus.SUCCESS));
        assertThat(listModuleEntityArgumentCaptorValues.get(0).get(0).finishedAt, notNullValue());
        assertThat(listModuleEntityArgumentCaptorValues.get(1).get(0).id, is(module2.id));
        assertThat(listModuleEntityArgumentCaptorValues.get(1).get(0).status, is(ModuleBuildStatus.SUCCESS));
        assertThat(listModuleEntityArgumentCaptorValues.get(1).get(0).finishedAt, notNullValue());

        verify(moduleRepository, times(2)).findByBuildId(anyString());
        verify(moduleRepository, times(2)).persist(moduleEntityArgumentCaptor.capture());
        var moduleEntityArgumentCaptorValues = moduleEntityArgumentCaptor.getAllValues();
        assertThat(moduleEntityArgumentCaptorValues.get(0).id, is(module1.id));
        assertThat(moduleEntityArgumentCaptorValues.get(0).status, is(ModuleBuildStatus.SUCCESS));
        assertThat(moduleEntityArgumentCaptorValues.get(0).finishedAt, notNullValue());
        assertThat(moduleEntityArgumentCaptorValues.get(1).id, is(module2.id));
        assertThat(moduleEntityArgumentCaptorValues.get(1).status, is(ModuleBuildStatus.SUCCESS));
        assertThat(moduleEntityArgumentCaptorValues.get(1).finishedAt, notNullValue());

        verify(buildRepository, times(2)).persist(buildEntityArgumentCaptor.capture());
        buildEntityArgumentCaptorValues = buildEntityArgumentCaptor.getAllValues();
        assertThat(buildEntityArgumentCaptorValues.get(0).id, is(build1.id));
        assertThat(buildEntityArgumentCaptorValues.get(0).status, is(BuildStatus.SUCCESS));
        assertThat(buildEntityArgumentCaptorValues.get(0).finishedAt, notNullValue());
        assertThat(buildEntityArgumentCaptorValues.get(1).id, is(build2.id));
        assertThat(buildEntityArgumentCaptorValues.get(1).status, is(BuildStatus.SUCCESS));
        assertThat(buildEntityArgumentCaptorValues.get(1).finishedAt, notNullValue());

    }

    @Test
    public void testNotifyBuildTimeoutWithSuccess() {

        // Mock - Docker Registry Configuration
        var registryConfigurationId = "a69c3cfb-5587-448f-b011-beae9a4a3fbb";

        when(dockerRegistryConfigurationRepository.findById(registryConfigurationId)).then(invocationOnMock -> {
            var entity = new DockerRegistryConfigurationEntity();
            entity.id = "edce5d09-e7a2-4763-910e-41c003f68fb9";
            entity.type = RegistryType.AZURE;
            entity.name = "Docker Registry";
            entity.createdAt = LocalDateTime.now();
            entity.connectionData =
                    new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData("http://registry/test",
                            "usertest", "passtest");
            return Optional.of(entity);
        });

        // Mock - Builds
        BuildEntity build1 = BuildEntity.create("tag_1", "http://callback.org", "42780fcb-1a6a-442c-97a4-78ffb90a5dc7");
        build1.id = "189fa7e8-2985-46a1-8aad-72c768df3fcd";

        BuildEntity build2 = BuildEntity.create("tag_1", "http://callback.org", "42780fcb-1a6a-442c-97a4-78ffb90a5dc7");
        build2.id = "ecbb5bb9-f56e-45e6-abdf-d0676647e9ed";

        when(buildRepository.findById(anyString())).thenAnswer(invocationOnMock -> {
            var buildId = invocationOnMock.getArgument(0);
            if (buildId.equals(build1.id)) {
                return build1;
            }
            if (buildId.equals(build2.id)) {
                return build2;
            }
            throw new InvalidUseOfMatchersException(String.format("Build id %s does not match", buildId));
        });

        // Mock - Modules
        ModuleEntity module1 = ModuleEntity
                .create("4f94780e-ebe1-4d4c-8a97-e3b01997492a", "module_1", "tag_1", build1.id, registryConfigurationId,
                        "http://registry/test");
        module1.id = "274fead7-6334-4d58-9834-d1bfa57fd1ef";

        ModuleEntity module2 = ModuleEntity
                .create("5ffa9132-0569-4216-9037-824f9d0f2755", "module_2", "tag_2", build2.id, registryConfigurationId,
                        "http://registry/test");
        module2.id = "84066c5c-a6e9-4343-8713-1f0b864c92cb";
        module2.createdAt = LocalDateTime.of(2020, 01, 01, 01, 01);

        mockModulesByStatus(module1, module2);

        var mockBuildModuleData = new HashMap<BuildEntity, List<ModuleEntity>>();
        mockBuildModuleData.put(build1, List.of(module1));
        mockBuildModuleData.put(build2, List.of(module2));

        mockModulesByBuild(mockBuildModuleData);

        // Mock - Components
        var componentEntity1 = ComponentEntity.create("module_1_component_1", "tag_1", module1.id);
        componentEntity1.id = "2dcd0966-526b-44d7-be00-db6dfc779ecf";
        var componentEntity2 = ComponentEntity.create("module_1_component_2", "tag_1", module1.id);
        componentEntity2.id = "1e873458-97f8-492b-9863-cc3ca71d7e23";
        var componentEntity3 = ComponentEntity.create("module_2_component_1", "tag_1", module2.id);
        componentEntity3.id = "6b3a665a-4cc3-4d34-8a84-ecc74989b8b3";
        var componentEntity4 = ComponentEntity.create("module_2_component_2", "tag_1", module2.id);
        componentEntity4.id = "a29910b5-47bf-483a-a873-ed86f3a6e88e";

        var mockModuleComponentData = new HashMap<ModuleEntity, List<ComponentEntity>>();
        mockModuleComponentData.put(module1, List.of(componentEntity1, componentEntity2));
        mockModuleComponentData.put(module2, List.of(componentEntity3, componentEntity4));

        mockComponentsByModule(mockModuleComponentData);

        // Mock - Registry Client
        doNothing().when(registryClient).configureAuthentication(eq(RegistryType.AZURE), any());
        when(registryClient.getImage(anyString(), anyString(), any())).thenAnswer(invocationOnMock -> {
            var name = invocationOnMock.getArgument(0);
            var tagName = invocationOnMock.getArgument(1);
            if (componentEntity1.name.equals(name) && componentEntity1.tagName.equals(tagName) ||
                    componentEntity2.name.equals(name) && componentEntity2.tagName.equals(tagName)) {
                return Optional.of(Response.ok().build());
            } else {
                return Optional.empty();
            }
        });

        // Execute
        var interactor = new UpdateBuildInfoInteractorImpl(buildRepository, moduleRepository, componentRepository,
                buildNotificationService, dockerRegistryConfigurationRepository, registryClient, 10);
        interactor.execute();

        // Check
        verify(dockerRegistryConfigurationRepository, times(2)).findById(registryConfigurationId);

        verify(registryClient, times(4)).getImage(anyString(), anyString(), any());

        verify(componentRepository, times(1)).findByModuleId(module1.id);

        verify(buildNotificationService, times(2))
                .notify(buildEntityArgumentCaptor.capture(), listModuleEntityArgumentCaptor.capture());
        var buildEntityArgumentCaptorValues = buildEntityArgumentCaptor.getAllValues();
        assertThat(buildEntityArgumentCaptorValues.get(0).id, is(build1.id));
        assertThat(buildEntityArgumentCaptorValues.get(0).status, is(BuildStatus.SUCCESS));
        assertThat(buildEntityArgumentCaptorValues.get(0).finishedAt, notNullValue());
        assertThat(buildEntityArgumentCaptorValues.get(1).id, is(build2.id));
        assertThat(buildEntityArgumentCaptorValues.get(1).status, is(BuildStatus.FAILURE));
        assertThat(buildEntityArgumentCaptorValues.get(1).finishedAt, notNullValue());
        var listModuleEntityArgumentCaptorValues = listModuleEntityArgumentCaptor.getAllValues();
        assertThat(listModuleEntityArgumentCaptorValues.get(0).get(0).id, is(module1.id));
        assertThat(listModuleEntityArgumentCaptorValues.get(0).get(0).status, is(ModuleBuildStatus.SUCCESS));
        assertThat(listModuleEntityArgumentCaptorValues.get(0).get(0).finishedAt, notNullValue());
        assertThat(listModuleEntityArgumentCaptorValues.get(1), is(Collections.EMPTY_LIST));

        verify(moduleRepository, times(2)).findByBuildId(anyString());
        verify(moduleRepository, times(2)).persist(moduleEntityArgumentCaptor.capture());
        var moduleEntityArgumentCaptorValues = moduleEntityArgumentCaptor.getAllValues();
        assertThat(moduleEntityArgumentCaptorValues.get(0).id, is(module1.id));
        assertThat(moduleEntityArgumentCaptorValues.get(0).status, is(ModuleBuildStatus.SUCCESS));
        assertThat(moduleEntityArgumentCaptorValues.get(0).finishedAt, notNullValue());
        assertThat(moduleEntityArgumentCaptorValues.get(1).id, is(module2.id));
        assertThat(moduleEntityArgumentCaptorValues.get(1).status, is(ModuleBuildStatus.TIME_OUT));
        assertThat(moduleEntityArgumentCaptorValues.get(1).finishedAt, notNullValue());

        verify(buildRepository, times(2)).persist(Mockito.any(BuildEntity.class));

    }

    @Test
    public void testNotifyBuildNotFinishedWithSuccess() {

        // Mock - Docker Registry Configuration
        var registryConfigurationId = "a69c3cfb-5587-448f-b011-beae9a4a3fbb";

        when(dockerRegistryConfigurationRepository.findById(registryConfigurationId)).then(invocationOnMock -> {
            var entity = new DockerRegistryConfigurationEntity();
            entity.id = "edce5d09-e7a2-4763-910e-41c003f68fb9";
            entity.type = RegistryType.AZURE;
            entity.name = "Docker Registry";
            entity.createdAt = LocalDateTime.now();
            entity.connectionData =
                    new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData("http://registry/test",
                            "usertest", "passtest");
            return Optional.of(entity);
        });

        // Mock - Builds
        BuildEntity build1 = BuildEntity.create("tag_1", "http://callback.org", "42780fcb-1a6a-442c-97a4-78ffb90a5dc7");
        build1.id = "189fa7e8-2985-46a1-8aad-72c768df3fcd";

        BuildEntity build2 = BuildEntity.create("tag_1", "http://callback.org", "42780fcb-1a6a-442c-97a4-78ffb90a5dc7");
        build2.id = "ecbb5bb9-f56e-45e6-abdf-d0676647e9ed";

        // Mock - Modules
        ModuleEntity module1 = ModuleEntity
                .create("4f94780e-ebe1-4d4c-8a97-e3b01997492a", "module_1", "tag_1", build1.id, registryConfigurationId,
                        "http://registry/test");
        module1.id = "274fead7-6334-4d58-9834-d1bfa57fd1ef";

        ModuleEntity module2 = ModuleEntity
                .create("5ffa9132-0569-4216-9037-824f9d0f2755", "module_2", "tag_2", build2.id, registryConfigurationId,
                        "http://registry/test");
        module2.id = "84066c5c-a6e9-4343-8713-1f0b864c92cb";

        mockModulesByStatus(module1, module2);

        var mockBuildModuleData = new HashMap<BuildEntity, List<ModuleEntity>>();
        mockBuildModuleData.put(build1, List.of(module1));
        mockBuildModuleData.put(build2, List.of(module2));

        mockModulesByBuild(mockBuildModuleData);

        // Mock - Components
        var componentEntity1 = ComponentEntity.create("module_1_component_1", "tag_1", module1.id);
        componentEntity1.id = "2dcd0966-526b-44d7-be00-db6dfc779ecf";
        var componentEntity2 = ComponentEntity.create("module_1_component_2", "tag_1", module1.id);
        componentEntity2.id = "1e873458-97f8-492b-9863-cc3ca71d7e23";
        var componentEntity3 = ComponentEntity.create("module_2_component_1", "tag_1", module2.id);
        componentEntity3.id = "6b3a665a-4cc3-4d34-8a84-ecc74989b8b3";
        var componentEntity4 = ComponentEntity.create("module_2_component_2", "tag_1", module2.id);
        componentEntity4.id = "a29910b5-47bf-483a-a873-ed86f3a6e88e";

        var mockModuleComponentData = new HashMap<ModuleEntity, List<ComponentEntity>>();
        mockModuleComponentData.put(module1, List.of(componentEntity1, componentEntity2));
        mockModuleComponentData.put(module2, List.of(componentEntity3, componentEntity4));

        mockComponentsByModule(mockModuleComponentData);

        // Mock - Registry Client
        doNothing().when(registryClient).configureAuthentication(eq(RegistryType.AZURE), any());
        when(registryClient.getImage(anyString(), anyString(), any())).thenReturn(Optional.empty());

        // Execute
        var interactor = new UpdateBuildInfoInteractorImpl(buildRepository, moduleRepository, componentRepository,
                buildNotificationService, dockerRegistryConfigurationRepository, registryClient, 10);
        interactor.execute();

        // Check
        verify(dockerRegistryConfigurationRepository, times(2)).findById(registryConfigurationId);

        verify(registryClient, times(2)).getImage(anyString(), anyString(), any());

        verify(componentRepository, times(1)).findByModuleId(module1.id);
        verify(componentRepository, times(1)).findByModuleId(module2.id);

        verify(buildNotificationService, times(0)).notify(any(), any());

        verify(moduleRepository, times(2)).findByBuildId(anyString());
        verify(moduleRepository, times(0)).persist(Mockito.any(ModuleEntity.class));

        verify(buildRepository, times(0)).persist(Mockito.any(BuildEntity.class));

    }

    @Test
    public void testDockerRegistryNotFound() throws ResourceNotFoundException {
        // Mock - Docker Registry Configuration
        var registryConfigurationId = "a69c3cfb-5587-448f-b011-beae9a4a3fbb";
        when(dockerRegistryConfigurationRepository.findById(registryConfigurationId)).then(invocationOnMock -> Optional.empty());

        // Mock - Builds
        BuildEntity build = BuildEntity.create("tag_1", "http://callback.org", "42780fcb-1a6a-442c-97a4-78ffb90a5dc7");
        build.id = "189fa7e8-2985-46a1-8aad-72c768df3fcd";

        // Mock - Modules
        ModuleEntity module = ModuleEntity
                .create("4f94780e-ebe1-4d4c-8a97-e3b01997492a", "module_1", "tag_1", build.id, registryConfigurationId,
                        "http://registry/test");
        module.id = "274fead7-6334-4d58-9834-d1bfa57fd1ef";

        mockModulesByStatus(module);

        // Mock - Components
        var componentEntity1 = ComponentEntity.create("module_1_component_1", "tag_1", module.id);
        componentEntity1.id = "2dcd0966-526b-44d7-be00-db6dfc779ecf";
        var componentEntity2 = ComponentEntity.create("module_1_component_2", "tag_1", module.id);
        componentEntity2.id = "1e873458-97f8-492b-9863-cc3ca71d7e23";

        var mockModuleComponentData = new HashMap<ModuleEntity, List<ComponentEntity>>();
        mockModuleComponentData.put(module, List.of(componentEntity1, componentEntity2));

        mockComponentsByModule(mockModuleComponentData);

        //Execute
        var interactor = new UpdateBuildInfoInteractorImpl(buildRepository, moduleRepository, componentRepository,
                buildNotificationService, dockerRegistryConfigurationRepository, registryClient, 10);
        Exception exception = assertThrows(ResourceNotFoundException.class, interactor::execute);

        assertThat(exception.getMessage(), is("Resource DOCKER_REGISTRY not found"));
    }

    private void mockComponentsByModule(Map<ModuleEntity, List<ComponentEntity>> mockData) {
        when(componentRepository.findByModuleId(anyString())).thenAnswer(invocationOnMock -> {
            var moduleId = invocationOnMock.getArgument(0);
            var moduleEntity = mockData.keySet().stream()
                    .filter(k -> k.id.equals(moduleId))
                    .findFirst()
                    .orElseThrow(
                            () -> new InvalidUseOfMatchersException(
                                    String.format("Module id %s does not match", moduleId)));
            return mockData.get(moduleEntity);
        });
    }

    private void mockModulesByBuild(Map<BuildEntity, List<ModuleEntity>> mockData) {
        when(moduleRepository.findByBuildId(anyString())).thenAnswer(invocationOnMock -> {
            var buildId = invocationOnMock.getArgument(0);
            var buildEntity = mockData.keySet().stream()
                    .filter(k -> k.id.equals(buildId))
                    .findFirst()
                    .orElseThrow(
                            () -> new InvalidUseOfMatchersException(
                                    String.format("Build id %s does not match", buildId)));
            return mockData.get(buildEntity);
        });
    }

    private void mockModulesByStatus(ModuleEntity... module) {
        when(moduleRepository.findModulesByStatus(ModuleBuildStatus.CREATED)).thenReturn(Arrays.asList(module));
    }

}
