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
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;


import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.AWSDockerRegistryAuth;
import io.charlescd.villager.interactor.registry.AzureDockerRegistryAuth;
import io.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import io.charlescd.villager.interactor.registry.impl.SaveDockerRegistryConfigurationInteractorImpl;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SaveDockerRegistryConfigurationInteractorTest {

    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Captor
    private ArgumentCaptor<DockerRegistryConfigurationEntity> captor;

    @Test
    public void testSaveAzureWithSuccess() {

        // Mock
        var id = UUID.randomUUID().toString();
        var createdAt = LocalDateTime.now();

        doAnswer(invocation -> {
            var arg0 = (DockerRegistryConfigurationEntity) invocation.getArgument(0);
            arg0.id = id;
            arg0.createdAt = createdAt;
            return null;
        }).when(dockerRegistryConfigurationRepository).save(any(DockerRegistryConfigurationEntity.class));

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository);

        var input = DockerRegistryConfigurationInput.builder()
                .withName("Test")
                .withAddress("http://test.org")
                .withRegistryType(RegistryType.AZURE)
                .withAuth(new AzureDockerRegistryAuth("usertest", "userpass"))
                .withWorkspaceId("6eef9a19-f83e-43d1-8f00-eb8f12d4f116")
                .withAuthorId("456337ed-7af2-4f0d-9dfb-6e285ad00ee0")
                .build();

        interactor.execute(input);

        // Check
        verify(dockerRegistryConfigurationRepository).save(captor.capture());

        var entityCaptured = captor.getValue();

        assertThat(entityCaptured.id, is(id));
        assertThat(entityCaptured.name, is("Test"));
        assertThat(entityCaptured.type, is(RegistryType.AZURE));
        assertThat(entityCaptured.authorId, is("456337ed-7af2-4f0d-9dfb-6e285ad00ee0"));
        assertThat(entityCaptured.workspaceId, is("6eef9a19-f83e-43d1-8f00-eb8f12d4f116"));
        assertThat(entityCaptured.createdAt, is(createdAt));
        assertThat(entityCaptured.connectionData.address, is("http://test.org"));
        assertThat(entityCaptured.connectionData.host, is("test.org"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData) entityCaptured.connectionData).username,
                is("usertest"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData) entityCaptured.connectionData).password,
                is("userpass"));

    }

    @Test
    public void testSaveAWSWithSuccess() {

        // Mock
        var id = UUID.randomUUID().toString();
        var createdAt = LocalDateTime.now();

        doAnswer(invocation -> {
            var arg0 = (DockerRegistryConfigurationEntity) invocation.getArgument(0);
            arg0.id = id;
            arg0.createdAt = createdAt;
            return null;
        }).when(dockerRegistryConfigurationRepository).save(any(DockerRegistryConfigurationEntity.class));

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository);

        var input = DockerRegistryConfigurationInput.builder()
                .withName("Test")
                .withAddress("http://test.org")
                .withRegistryType(RegistryType.AWS)
                .withAuth(new AWSDockerRegistryAuth("accesskeytest", "secretkeytest", "regiontest"))
                .withWorkspaceId("6eef9a19-f83e-43d1-8f00-eb8f12d4f116")
                .withAuthorId("456337ed-7af2-4f0d-9dfb-6e285ad00ee0")
                .build();

        interactor.execute(input);

        // Check
        verify(dockerRegistryConfigurationRepository).save(captor.capture());

        var entityCaptured = captor.getValue();

        assertThat(entityCaptured.id, is(id));
        assertThat(entityCaptured.name, is("Test"));
        assertThat(entityCaptured.type, is(RegistryType.AWS));
        assertThat(entityCaptured.authorId, is("456337ed-7af2-4f0d-9dfb-6e285ad00ee0"));
        assertThat(entityCaptured.workspaceId, is("6eef9a19-f83e-43d1-8f00-eb8f12d4f116"));
        assertThat(entityCaptured.createdAt, is(createdAt));
        assertThat(entityCaptured.connectionData.address, is("http://test.org"));
        assertThat(entityCaptured.connectionData.host, is("test.org"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) entityCaptured.connectionData).accessKey,
                is("accesskeytest"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) entityCaptured.connectionData).secretKey,
                is("secretkeytest"));
        assertThat(
                ((DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) entityCaptured.connectionData).region,
                is("regiontest"));

        verify(dockerRegistryConfigurationRepository, times(1)).save(any());

    }

    @Test
    public void testRepositoryError() {

        // Mock
        doThrow(new RuntimeException("Testing")).when(dockerRegistryConfigurationRepository).save(any());

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository);

        var input = DockerRegistryConfigurationInput.builder()
                .withName("Test")
                .withAddress("http://test.org")
                .withRegistryType(RegistryType.AWS)
                .withAuth(new AWSDockerRegistryAuth("accesskeytest", "secretkeytest", "regiontest"))
                .withWorkspaceId("6eef9a19-f83e-43d1-8f00-eb8f12d4f116")
                .withAuthorId("456337ed-7af2-4f0d-9dfb-6e285ad00ee0")
                .build();

        Exception exception = assertThrows(RuntimeException.class, () -> {
            interactor.execute(input);
        });

        // Check
        assertThat(exception.getMessage(), Matchers.is("Testing"));
        verify(dockerRegistryConfigurationRepository, times(1)).save(any());

    }

    @Test
    public void testRegistryTypeNotSupported() {

        // Call
        var interactor = new SaveDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository);

        var input = DockerRegistryConfigurationInput.builder()
                .withName("Test")
                .withAddress("http://test.org")
                .withRegistryType(RegistryType.UNSUPPORTED)
                .withWorkspaceId("6eef9a19-f83e-43d1-8f00-eb8f12d4f116")
                .withAuthorId("456337ed-7af2-4f0d-9dfb-6e285ad00ee0")
                .build();

        Exception exception = assertThrows(IllegalStateException.class, () -> interactor.execute(input));

        // Check
        assertThat(exception.getMessage(), Matchers.is("Registry type not supported!"));
        verify(dockerRegistryConfigurationRepository, times(0)).save(any());

    }
}
