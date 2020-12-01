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

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.DockerHubDockerRegistryAuth;
import io.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import io.charlescd.villager.interactor.registry.GCPDockerRegistryAuth;
import io.charlescd.villager.interactor.registry.*;
import io.charlescd.villager.interactor.registry.impl.SaveDockerRegistryConfigurationInteractorImpl;
import io.charlescd.villager.service.RegistryService;
import io.charlescd.villager.utils.DockerRegistryTestUtils;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SaveDockerRegistryConfigurationInteractorTest {

    private static final String ID_DEFAULT_VALUE = "1a3d413d-2255-4a1b-94ba-82e7366e4342";

    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Mock
    private RegistryService registryService;

    @Captor
    private ArgumentCaptor<DockerRegistryConfigurationEntity> captor;

    @Test
    public void testSaveAzureWithSuccess() {

        // Mock
        var id = UUID.randomUUID().toString();
        var createdAt = LocalDateTime.now();

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.AZURE);
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.AZURE);

        Mockito.when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doAnswer(invocation -> {
            var arg0 = (DockerRegistryConfigurationEntity) invocation.getArgument(0);
            arg0.id = id;
            arg0.createdAt = createdAt;
            return null;
        }).when(dockerRegistryConfigurationRepository).save(any(DockerRegistryConfigurationEntity.class));

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository, registryService);

        interactor.execute(input);

        // Check
        verify(dockerRegistryConfigurationRepository).save(captor.capture());

        var entityCaptured = captor.getValue();

        assertThat(entityCaptured.id, is(id));
        assertThat(entityCaptured.name, is("Testing"));
        assertThat(entityCaptured.type, is(RegistryType.AZURE));
        assertThat(entityCaptured.authorId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.workspaceId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.createdAt, is(createdAt));
        assertThat(entityCaptured.connectionData.address, is("https://registry.io.com"));
        assertThat(entityCaptured.connectionData.host, is("registry.io.com"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData) entityCaptured.connectionData).username,
                is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData) entityCaptured.connectionData).password,
                is("charles_cd"));
    }

    @Test
    public void testSaveHarborWithSuccess() {

        // Mock
        var id = UUID.randomUUID().toString();
        var createdAt = LocalDateTime.now();

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.HARBOR);
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.HARBOR);

        Mockito.when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doAnswer(invocation -> {
            var arg0 = (DockerRegistryConfigurationEntity) invocation.getArgument(0);
            arg0.id = id;
            arg0.createdAt = createdAt;
            return null;
        }).when(dockerRegistryConfigurationRepository).save(any(DockerRegistryConfigurationEntity.class));

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository, registryService);

        interactor.execute(input);

        // Check
        verify(dockerRegistryConfigurationRepository).save(captor.capture());

        var entityCaptured = captor.getValue();

        assertThat(entityCaptured.id, is(id));
        assertThat(entityCaptured.name, is("Testing"));
        assertThat(entityCaptured.type, is(RegistryType.HARBOR));
        assertThat(entityCaptured.authorId, is("1a3d413d-2255-4a1b-94ba-82e7366e4342"));
        assertThat(entityCaptured.workspaceId, is("1a3d413d-2255-4a1b-94ba-82e7366e4342"));
        assertThat(entityCaptured.createdAt, is(createdAt));
        assertThat(entityCaptured.connectionData.address, is("https://registry.io.com"));
        assertThat(entityCaptured.connectionData.host, is("registry.io.com"));
        assertThat(
                ((DockerRegistryConfigurationEntity.HarborDockerRegistryConnectionData) entityCaptured.connectionData).username,
                is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.HarborDockerRegistryConnectionData) entityCaptured.connectionData).password,
                is("charles_cd"));

    }

    @Test
    public void testSaveAWSWithSuccess() {

        // Mock
        var id = UUID.randomUUID().toString();
        var createdAt = LocalDateTime.now();

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.AWS);
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.AWS);

        Mockito.when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doAnswer(invocation -> {
            var arg0 = (DockerRegistryConfigurationEntity) invocation.getArgument(0);
            arg0.id = id;
            arg0.createdAt = createdAt;
            return null;
        }).when(dockerRegistryConfigurationRepository).save(any(DockerRegistryConfigurationEntity.class));

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository, registryService);

        interactor.execute(input);

        // Check
        verify(dockerRegistryConfigurationRepository).save(captor.capture());

        var entityCaptured = captor.getValue();

        assertThat(entityCaptured.id, is(id));
        assertThat(entityCaptured.name, is("Testing"));
        assertThat(entityCaptured.type, is(RegistryType.AWS));
        assertThat(entityCaptured.authorId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.workspaceId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.createdAt, is(createdAt));
        assertThat(entityCaptured.connectionData.address, is("https://registry.io.com"));
        assertThat(entityCaptured.connectionData.host, is("registry.io.com"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) entityCaptured.connectionData).accessKey,
                is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) entityCaptured.connectionData).secretKey,
                is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) entityCaptured.connectionData).region,
                is("charles_cd"));

        verify(dockerRegistryConfigurationRepository, times(1)).save(any());

    }

    @Test
    public void testSaveGCPWithSuccess() {

        // Mock
        var id = UUID.randomUUID().toString();
        var createdAt = LocalDateTime.now();

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.GCP);
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.GCP);

        Mockito.when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doAnswer(invocation -> {
            var arg0 = (DockerRegistryConfigurationEntity) invocation.getArgument(0);
            arg0.id = id;
            arg0.createdAt = createdAt;
            return null;
        }).when(dockerRegistryConfigurationRepository).save(any(DockerRegistryConfigurationEntity.class));

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository, registryService);

        interactor.execute(input);

        // Check
        verify(dockerRegistryConfigurationRepository).save(captor.capture());

        var entityCaptured = captor.getValue();

        assertThat(entityCaptured.id, is(id));
        assertThat(entityCaptured.name, is("Testing"));
        assertThat(entityCaptured.type, is(RegistryType.GCP));
        assertThat(entityCaptured.authorId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.workspaceId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.createdAt, is(createdAt));
        assertThat(entityCaptured.connectionData.address, is("https://registry.io.com"));
        assertThat(entityCaptured.connectionData.host, is("registry.io.com/charles_cd"));
        assertThat(entityCaptured.connectionData.organization, is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData) entityCaptured.connectionData).username,
                is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData) entityCaptured.connectionData).jsonKey,
                is("charles_cd"));

    }

    @Test
    public void testSaveDockerHubWithSuccess() {

        // Mock
        var id = UUID.randomUUID().toString();
        var createdAt = LocalDateTime.now();

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.DOCKER_HUB);
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.DOCKER_HUB);

        Mockito.when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doAnswer(invocation -> {
            var arg0 = (DockerRegistryConfigurationEntity) invocation.getArgument(0);
            arg0.id = id;
            arg0.createdAt = createdAt;
            return null;
        }).when(dockerRegistryConfigurationRepository).save(any(DockerRegistryConfigurationEntity.class));

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository, registryService);

        interactor.execute(input);

        // Check
        verify(dockerRegistryConfigurationRepository).save(captor.capture());

        var entityCaptured = captor.getValue();

        assertThat(entityCaptured.id, is(id));
        assertThat(entityCaptured.name, is("Testing"));
        assertThat(entityCaptured.type, is(RegistryType.DOCKER_HUB));
        assertThat(entityCaptured.authorId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.workspaceId, is(ID_DEFAULT_VALUE));
        assertThat(entityCaptured.createdAt, is(createdAt));
        assertThat(entityCaptured.connectionData.address, is("https://registry.io.com"));
        assertThat(entityCaptured.connectionData.host, is("registry.io.com/charles_cd"));
        assertThat(entityCaptured.connectionData.organization, is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData) entityCaptured.connectionData).username,
                is("charles_cd"));
        assertThat(
                ((DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData) entityCaptured.connectionData).password,
                is("charles_cd"));
    }

    @Test
    public void testRepositoryError() {


        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.AWS);
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.AWS);

        Mockito.when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        // Mock
        doThrow(new RuntimeException("Testing")).when(dockerRegistryConfigurationRepository).save(any());

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository, registryService);


        Exception exception = assertThrows(RuntimeException.class, () -> {
            interactor.execute(input);
        });

        // Check
        assertThat(exception.getMessage(), Matchers.is("Testing"));
        verify(dockerRegistryConfigurationRepository, times(1)).save(any());

    }

    @Test
    public void testRegistryTypeNotSupported() {

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInputWithInvalidRegistry();

        Mockito.when(registryService.fromDockerRegistryConfigurationInput(input)).thenThrow(IllegalStateException.class);


        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository, registryService);

        Exception exception = assertThrows(IllegalStateException.class, () -> interactor.execute(input));

        // Check
        verify(dockerRegistryConfigurationRepository, times(0)).save(any());

    }
}