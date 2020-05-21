package br.com.zup.charlescd.villager.interactor.registry.impl;

import br.com.zup.charlescd.villager.exceptions.ResourceNotFoundException;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.wildfly.common.Assert;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DeleteDockerRegistryConfigurationInteractorImplTest {

    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Captor
    private ArgumentCaptor<DockerRegistryConfigurationEntity> captor;

    @Test
    public void whenRegistryConfigurationIdDoesNotExistsShouldThrowException() {
        var registryConfigurationId = "ba7006e0-a653-46dd-90be-71a0987f548a";
        var workspaceId = "4981446c-9c6c-4abf-acae-f04359df9b30";

        doReturn(false).when(dockerRegistryConfigurationRepository).exists(registryConfigurationId, workspaceId);

        var interactor = new DeleteDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository);

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> interactor.execute(registryConfigurationId, workspaceId)
        );

        Assert.assertTrue(thrown.getMessage().contains(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY.name()));

        verify(dockerRegistryConfigurationRepository, times(1)).exists(registryConfigurationId, workspaceId);
        verify(dockerRegistryConfigurationRepository, times(0)).delete(registryConfigurationId, workspaceId);
    }

    @Test
    public void shouldDeleteDockerRegistryConfigurationSuccessfully() {
        var registryConfigurationId = "ba7006e0-a653-46dd-90be-71a0987f548a";
        var workspaceId = "4981446c-9c6c-4abf-acae-f04359df9b30";

        doReturn(true).when(dockerRegistryConfigurationRepository).exists(registryConfigurationId, workspaceId);

        var interactor = new DeleteDockerRegistryConfigurationInteractorImpl(dockerRegistryConfigurationRepository);

        interactor.execute(registryConfigurationId, workspaceId);

        verify(dockerRegistryConfigurationRepository, times(1)).exists(registryConfigurationId, workspaceId);
        verify(dockerRegistryConfigurationRepository, times(1)).delete(registryConfigurationId, workspaceId);
    }

}