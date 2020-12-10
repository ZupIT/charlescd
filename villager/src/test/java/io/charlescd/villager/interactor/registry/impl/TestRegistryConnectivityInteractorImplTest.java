package io.charlescd.villager.interactor.registry.impl;

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.service.RegistryService;
import io.charlescd.villager.utils.DockerRegistryTestUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TestRegistryConnectivityInteractorImplTest {

    private static final String ID_DEFAULT_VALUE = "1a3d413d-2255-4a1b-94ba-82e7366e4342";

    @Mock
    private RegistryService registryService;

    @Test
    public void testGCPRegistryConnectionIsOK() {

        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        var input = DockerRegistryTestUtils.generateTestDockerRegistryConnectionInput(registryType);

        when(registryService.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE)).thenReturn(entity);

        var interactor =
                new TestRegistryConnectivityInteractorImpl(registryService);

        interactor.execute(input);

        verify(registryService, times(1))
                .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

    }

    @Test()
    public void testGCPRegistryConnectionIsInvalid() throws IllegalArgumentException {

        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        var input = DockerRegistryTestUtils.generateTestDockerRegistryConnectionInput(registryType);

        when(registryService.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE)).thenReturn(entity);

        doThrow(new IllegalArgumentException("Invalid registry")).when(registryService).testRegistryConnectivityConfig(entity);

        var interactor =
                new TestRegistryConnectivityInteractorImpl(registryService);

        try {
            interactor.execute(input);
        } catch (Exception ex) {
        }

        verify(registryService, times(1))
                .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

        assertThrows(IllegalArgumentException.class, () -> registryService.testRegistryConnectivityConfig(entity));

    }

}
