package io.charlescd.villager.interactor.registry.impl;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import io.charlescd.villager.service.RegistryService;
import io.charlescd.villager.utils.DockerRegistryTestUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;



@ExtendWith(MockitoExtension.class)
public class TestRegistryConfigInteractorImplTest {

    @Mock
    private RegistryService registryService;

    @Test
    public void testGCPRegistryConfigIsOK() {

        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        DockerRegistryConfigurationInput input = DockerRegistryTestUtils
                .generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        interactor.execute(input);

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

    }

    @Test
    public void testGCPRegistryConfigIsInvalid() {

        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doThrow(new IllegalArgumentException("Invalid registry")).when(registryService)
                .testRegistryConnectivityConfig(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        try {
            interactor.execute(input);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

        assertThrows(IllegalArgumentException.class, () -> registryService.testRegistryConnectivityConfig(entity));

    }
    
    @Test
    public void testAzureRegistryConfigIsOK() {

        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        DockerRegistryConfigurationInput input = DockerRegistryTestUtils
                .generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        interactor.execute(input);

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

    }

    @Test
    public void testAzureRegistryConfigIsInvalid() {

        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doThrow(new IllegalArgumentException("Invalid registry")).when(registryService)
                .testRegistryConnectivityConfig(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        try {
            interactor.execute(input);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

        assertThrows(IllegalArgumentException.class, () -> registryService.testRegistryConnectivityConfig(entity));

    }

    @Test
    public void testHarborRegistryConfigIsOK() {

        var registryType = RegistryType.HARBOR;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        DockerRegistryConfigurationInput input = DockerRegistryTestUtils
                .generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        interactor.execute(input);

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

    }

    @Test
    public void testHarborRegistryConfigIsInvalid() {

        var registryType = RegistryType.HARBOR;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doThrow(new IllegalArgumentException("Invalid registry")).when(registryService)
                .testRegistryConnectivityConfig(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        try {
            interactor.execute(input);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

        assertThrows(IllegalArgumentException.class, () -> registryService.testRegistryConnectivityConfig(entity));

    }

    @Test
    public void testDockerHubRegistryConfigIsOK() {

        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        DockerRegistryConfigurationInput input = DockerRegistryTestUtils
                .generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        interactor.execute(input);

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

    }

    @Test
    public void testDockerHubRegistryConfigIsInvalid() {

        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doThrow(new IllegalArgumentException("Invalid registry")).when(registryService)
                .testRegistryConnectivityConfig(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        try {
            interactor.execute(input);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

        assertThrows(IllegalArgumentException.class, () -> registryService.testRegistryConnectivityConfig(entity));

    }

    @Test
    public void testAWSRegistryConfigIsOK() {

        var registryType = RegistryType.AWS;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        DockerRegistryConfigurationInput input = DockerRegistryTestUtils
                .generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        interactor.execute(input);

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

    }

    @Test
    public void testAWSRegistryConfigIsInvalid() {

        var registryType = RegistryType.AWS;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(registryType);

        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);

        doThrow(new IllegalArgumentException("Invalid registry")).when(registryService)
                .testRegistryConnectivityConfig(entity);

        var interactor =
                new TestRegistryConfigInteractorImpl(registryService);

        try {
            interactor.execute(input);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        verify(registryService, times(1))
                .fromDockerRegistryConfigurationInput(input);

        verify(registryService, times(1))
                .testRegistryConnectivityConfig(entity);

        assertThrows(IllegalArgumentException.class, () -> registryService.testRegistryConnectivityConfig(entity));

    }
}
