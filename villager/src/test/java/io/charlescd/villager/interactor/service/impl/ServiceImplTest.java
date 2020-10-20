package io.charlescd.villager.interactor.service.impl;

import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.IntegrationException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.*;
import io.charlescd.villager.service.impl.RegistryServiceImpl;
import io.charlescd.villager.utils.DockerRegistryTestUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ServiceImplTest {

    private static final String ARTIFACT_NAME = "charles_cd";
    private static final String ADDRESS = "https://registry.io.com";
    private static final String STRING_DEFAULT_VALUE = "charlescd";
    private static final String ID_DEFAULT_VALUE = "1a3d413d-2255-4a1b-94ba-82e7366e4342";
    private static final String TAG_NAME = "test";

    @Mock
    private RegistryClient registryClient;

    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

//    @Test
//    public void testGCPRegistryConfigIsOK() {
//
//        var registryType = RegistryType.GCP;
//        var entity = generateDockerRegistryConfigurationEntity(registryType, getConnectionData(registryType));
//        DockerRegistryConfigurationInput input = generateDockerRegistryConfigurationInput(registryType, entity.connectionData);
//
//        when(registryService.fromDockerRegistryConfigurationInput(input)).thenReturn(entity);
//
//        when(registryService.getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME)).thenReturn(Optional.of(getResponse(404)));
//
//        var interactor =
//                new TestRegistryConfigInteractorImpl(registryService);
//
//        interactor.execute(input);
//
//        verify(registryService, times(1))
//                .fromDockerRegistryConfigurationInput(input);
//
//        verify(registryService, times(1))
//                .getDockerRegistryTag(entity, ARTIFACT_NAME, TAG_NAME);
//
//    }

    @Test
    public void testGetDockerRegistryConfigurationEntitySuccess() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType, DockerRegistryTestUtils.getConnectionData(registryType));

        when(dockerRegistryConfigurationRepository.findById(ID_DEFAULT_VALUE)).thenReturn(Optional.of(entity));

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        DockerRegistryConfigurationEntity responseEntity = serviceImpl.getDockerRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);

        verify(dockerRegistryConfigurationRepository, times(1))
                .findById(ID_DEFAULT_VALUE);

        assertEquals(entity, responseEntity);
    }


    @Test
    public void testGetDockerRegistryConfigurationEntityNotFound() {
        var registryType = RegistryType.GCP;

        when(dockerRegistryConfigurationRepository.findById(ID_DEFAULT_VALUE)).thenThrow(ResourceNotFoundException.class);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        try {
            serviceImpl.getDockerRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        } catch (Exception ex) {
        }

        verify(dockerRegistryConfigurationRepository, times(1))
                .findById(ID_DEFAULT_VALUE);

        assertThrows(ResourceNotFoundException.class, () -> dockerRegistryConfigurationRepository.findById(ID_DEFAULT_VALUE));
    }


    @Test
    public void testGetDockerRegistryConfigurationEntityInvalidWorkspace() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType, DockerRegistryTestUtils.getConnectionData(registryType));
        entity.workspaceId = "123";

        when(dockerRegistryConfigurationRepository.findById(ID_DEFAULT_VALUE)).thenReturn(Optional.of(entity));

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        try {
            serviceImpl.getDockerRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        } catch (Exception ex) {
        }

        verify(dockerRegistryConfigurationRepository, times(1))
                .findById(ID_DEFAULT_VALUE);


        assertThrows(IllegalAccessResourceException.class, () -> serviceImpl.getDockerRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE));
    }

    @Test
    public void testGetRegistryTagInvalidRegistryType() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType, DockerRegistryTestUtils.getConnectionData(registryType));


        doThrow(IllegalArgumentException.class).when(registryClient).configureAuthentication(registryType, entity.connectionData, ID_DEFAULT_VALUE);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        try {
            serviceImpl.getDockerRegistryTag(entity, ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);
        } catch (Exception ex) {
        }

        verify(registryClient, times(1))
                .configureAuthentication(registryType, entity.connectionData, ID_DEFAULT_VALUE);

        verify(registryClient, times(0))
                .getImage(STRING_DEFAULT_VALUE, STRING_DEFAULT_VALUE, entity.connectionData);

        assertThrows(IllegalArgumentException.class, () -> registryClient.configureAuthentication(registryType, entity.connectionData, ID_DEFAULT_VALUE));
    }

    @Test
    public void testTestRegistryConnectivityOK() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType, DockerRegistryTestUtils.getConnectionData(registryType));

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData)).thenReturn(Optional.of(Response.ok().build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1))
                .configureAuthentication(registryType, entity.connectionData, ARTIFACT_NAME); //TODO: Verify

        verify(registryClient, times(1))
                .getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);


    }

    @Test
    public void testTestRegistryConnectivityInvalid() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType, DockerRegistryTestUtils.getConnectionData(registryType));

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData)).thenReturn(Optional.of(Response.status(401).build()));

        try {
            serviceImpl.testRegistryConnectivityConfig(entity);
        } catch (Exception ex) {

        }

        verify(registryClient, times(1))
                .configureAuthentication(registryType, entity.connectionData, ARTIFACT_NAME); //TODO: Verify

        verify(registryClient, times(1))
                .getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);

        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

    }

    @Test
    public void testTestRegistryConnectivityUnexpectedError() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType, DockerRegistryTestUtils.getConnectionData(registryType));

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData)).thenReturn(Optional.of(Response.status(504).build()));

        try {
            serviceImpl.testRegistryConnectivityConfig(entity);
        } catch (Exception ex) {

        }

        verify(registryClient, times(1))
                .configureAuthentication(registryType, entity.connectionData, ARTIFACT_NAME); //TODO: Verify

        verify(registryClient, times(1))
                .getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);

        assertThrows(IntegrationException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

    }
}
