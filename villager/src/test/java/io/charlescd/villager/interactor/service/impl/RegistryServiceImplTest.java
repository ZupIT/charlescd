package io.charlescd.villager.interactor.service.impl;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.exceptions.ThirdPartyIntegrationException;
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.service.impl.RegistryServiceImpl;
import io.charlescd.villager.utils.DockerRegistryTestUtils;
import java.util.Optional;
import javax.ws.rs.core.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class RegistryServiceImplTest {

    private static final String ARTIFACT_NAME = "charles_cd";
    private static final String STRING_DEFAULT_VALUE = "charlescd";
    private static final String ID_DEFAULT_VALUE = "1a3d413d-2255-4a1b-94ba-82e7366e4342";
    private static final String TAG_NAME = "test";

    @Mock
    private RegistryClient registryClient;


    @Mock
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Test
    public void testGetDockerRegistryConfigurationEntitySuccess() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        when(dockerRegistryConfigurationRepository.findById(ID_DEFAULT_VALUE)).thenReturn(Optional.of(entity));

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        DockerRegistryConfigurationEntity responseEntity = serviceImpl
                        .getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE);

        verify(dockerRegistryConfigurationRepository, times(1)).findById(ID_DEFAULT_VALUE);

        assertEquals(entity, responseEntity);
    }

    @Test
    public void testGetDockerRegistryConfigurationEntityNotFound() {

        when(dockerRegistryConfigurationRepository.findById(ID_DEFAULT_VALUE))
                        .thenThrow(ResourceNotFoundException.class);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        assertThrows(ResourceNotFoundException.class,
                        () -> serviceImpl.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE));

        verify(dockerRegistryConfigurationRepository, times(1)).findById(ID_DEFAULT_VALUE);
    }

    @Test
    public void testGetDockerRegistryConfigurationEntityInvalidWorkspace() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        entity.workspaceId = "123";

        when(dockerRegistryConfigurationRepository.findById(ID_DEFAULT_VALUE)).thenReturn(Optional.of(entity));

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        Exception exception = assertThrows(IllegalAccessResourceException.class,
                        () -> serviceImpl.getRegistryConfigurationEntity(ID_DEFAULT_VALUE, ID_DEFAULT_VALUE));

        verify(dockerRegistryConfigurationRepository, times(1)).findById(ID_DEFAULT_VALUE);

        assertThat(exception.getMessage(),
                        is("This docker registry does not belongs to the request application id."));
    }

    @Test
    public void testGetRegistryTagInvalidRegistryType() {
        var registryType = RegistryType.UNSUPPORTED;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        doThrow(IllegalArgumentException.class).when(registryClient).configureAuthentication(registryType,
                        entity.connectionData, ID_DEFAULT_VALUE);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        assertThrows(RuntimeException.class,
                        () -> serviceImpl.getDockerRegistryTag(entity, ID_DEFAULT_VALUE, ID_DEFAULT_VALUE));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ID_DEFAULT_VALUE);

        verify(registryClient, times(0)).getImage(STRING_DEFAULT_VALUE, STRING_DEFAULT_VALUE,
                        entity.connectionData);

    }

    @Test
    public void testGetRegistryTagGeneralError() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);
        doThrow(RuntimeException.class).when(registryClient).configureAuthentication(registryType,
                        entity.connectionData, ID_DEFAULT_VALUE);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.getDockerRegistryTag(entity, ID_DEFAULT_VALUE, ID_DEFAULT_VALUE));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ID_DEFAULT_VALUE);

        verify(registryClient, times(0)).getImage(STRING_DEFAULT_VALUE, STRING_DEFAULT_VALUE,
                            entity.connectionData);

    }

    @Test
    public void testTestRegistryGCPConnectivityOKWhen404Return() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(404).build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);
    }

    @Test
    public void testTestRegistryDockerHubConnectivityOKWhen404Return() {
        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(404).build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);
    }

    @Test
    public void testTestRegistryAzureConnectivityOKWhen404Return() {
        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(404).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryHarborConnectivityOKWhen404Return() {
        var registryType = RegistryType.HARBOR;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(404).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryAWSConnectivityOKWhen404Return() {
        var registryType = RegistryType.AWS;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(404).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryGCPConnectivityOKWhen2xxReturn() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                .thenReturn(Optional.of(Response.ok().build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);
    }

    @Test
    public void testTestRegistryDockerHubConnectivityOKWhen2xxReturn() {
        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                .thenReturn(Optional.of(Response.ok().build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);
    }

    @Test
    public void testTestRegistryAzureConnectivityOKWhen2xxReturn() {
        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData)).thenReturn(Optional.of(Response.ok().build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryAWSConnectivityOKWhen2xxReturn() {
        var registryType = RegistryType.AWS;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData)).thenReturn(Optional.of(Response.ok().build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryHarborConnectivityOKWhen2xxReturn() {
        var registryType = RegistryType.HARBOR;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData)).thenReturn(Optional.of(Response.ok().build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryGCPConnectivityUnathorized() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(401).build()));
        
        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);

    }

    @Test
    public void testTestRegistryDockerHubConnectivityUnathorized() {
        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(401).build()));
        
        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);

    }

    @Test
    public void testTestRegistryAzureConnectivityUnathorized() {
        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(401).build()));
        
        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);

    }

    @Test
    public void testTestRegistryHarborConnectivityUnathorized() {
        var registryType = RegistryType.HARBOR;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(401).build()));
        
        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);

    }

    @Test
    public void testTestRegistryAWSConnectivityUnathorized() {
        var registryType = RegistryType.AWS;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(401).build()));
        
        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);

    }

    @Test
    public void testTestRegistryGCPConnectivityForbidden() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(403).build()));

        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);
    }

    @Test
    public void testTestRegistryDockerHubConnectivityForbidden() {
        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(403).build()));

        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);
    }

    @Test
    public void testTestRegistryAzureConnectivityForbidden() {
        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(403).build()));

        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryHarborConnectivityForbidden() {
        var registryType = RegistryType.HARBOR;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(403).build()));

        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryAWSConnectivityForbidden() {
        var registryType = RegistryType.AWS;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(403).build()));

        assertThrows(IllegalArgumentException.class, () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);
    }

    @Test
    public void testTestRegistryGCPConnectivityUnexpectedError() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(504).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));
        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);

    }

    @Test
    public void testTestRegistryDockerHubConnectivityUnexpectedError() {
        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(504).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));
        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData);

    }

    @Test
    public void testTestRegistryAzureConnectivityUnexpectedError() {
        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(504).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));
        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);

    }

    @Test
    public void testTestRegistryHarborConnectivityUnexpectedError() {
        var registryType = RegistryType.HARBOR;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(504).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));
        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);

    }

    @Test
    public void testTestRegistryAWSConnectivityUnexpectedError() {
        var registryType = RegistryType.AWS;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getV2Path(entity.connectionData))
                        .thenReturn(Optional.of(Response.status(504).build()));

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));
        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

        verify(registryClient, times(1)).getV2Path(entity.connectionData);

    }

    @Test
    public void testTestRegistryInvalidRegistry() {
        var registryType = RegistryType.UNSUPPORTED;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        doThrow(IllegalArgumentException.class).when(registryClient).configureAuthentication(registryType,
                        entity.connectionData, ID_DEFAULT_VALUE);

        assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                            ARTIFACT_NAME);

    }

    @Test
    public void testFromDockerRegistryGCPConfigurationInput() {

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.GCP);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        DockerRegistryConfigurationEntity entity = serviceImpl.fromDockerRegistryConfigurationInput(input);

        assertEquals(entity.authorId, input.getAuthorId());
        assertEquals(entity.workspaceId, input.getWorkspaceId());
        assertEquals(entity.type, RegistryType.GCP);
        assertEquals(entity.connectionData.address, input.getAddress());
    }


    @Test
    public void testFromDockerRegistryAzureConfigurationInput() {

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.AZURE);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        DockerRegistryConfigurationEntity entity = serviceImpl.fromDockerRegistryConfigurationInput(input);

        assertEquals(entity.authorId, input.getAuthorId());
        assertEquals(entity.workspaceId, input.getWorkspaceId());
        assertEquals(entity.type, RegistryType.AZURE);
        assertEquals(entity.connectionData.address, input.getAddress());
    }

    @Test
    public void testFromDockerRegistryAWSConfigurationInput() {

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.AWS);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        DockerRegistryConfigurationEntity entity = serviceImpl.fromDockerRegistryConfigurationInput(input);

        assertEquals(entity.authorId, input.getAuthorId());
        assertEquals(entity.workspaceId, input.getWorkspaceId());
        assertEquals(entity.type, RegistryType.AWS);
        assertEquals(entity.connectionData.address, input.getAddress());
    }

    @Test
    public void testFromDockerRegistryDockerHuberConfigurationInput() {

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.DOCKER_HUB);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        DockerRegistryConfigurationEntity entity = serviceImpl.fromDockerRegistryConfigurationInput(input);

        assertEquals(entity.authorId, input.getAuthorId());
        assertEquals(entity.workspaceId, input.getWorkspaceId());
        assertEquals(entity.type, RegistryType.DOCKER_HUB);
        assertEquals(entity.connectionData.address, input.getAddress());
    }

    @Test
    public void testFromDockerInvalidRegistryConfigurationInput() {

        var input = DockerRegistryTestUtils.generateDockerRegistryConfigurationInput(RegistryType.UNSUPPORTED);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        Exception exception = assertThrows(IllegalStateException.class,
                        () -> serviceImpl.fromDockerRegistryConfigurationInput(input));

        assertThat(exception.getMessage(), is("Registry type not supported!"));

    }

    @Test
    public void testRegistryGetImageResponseIsNull() {
        var registryType = RegistryType.GCP;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);
        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData)).thenReturn(null);

        Exception exception = assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));

        assertThat(exception.getMessage(), is("Registry service not respond."));

    }

    @Test
    public void testRegistryGetV2PathResponseIsNull() {
        var registryType = RegistryType.AZURE;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);
        when(registryClient.getV2Path(entity.connectionData)).thenReturn(null);

        Exception exception = assertThrows(ThirdPartyIntegrationException.class,
                        () -> serviceImpl.testRegistryConnectivityConfig(entity));

        assertThat(exception.getMessage(), is("Registry service not respond."));

    }

    @Test
    public void testTestRegistryDockerHub() {
        var registryType = RegistryType.DOCKER_HUB;
        var entity = DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(registryType);

        var serviceImpl = new RegistryServiceImpl(dockerRegistryConfigurationRepository, registryClient);

        when(registryClient.getImage(ARTIFACT_NAME, TAG_NAME, entity.connectionData))
                        .thenReturn(Optional.of(Response.status(404).build()));

        serviceImpl.testRegistryConnectivityConfig(entity);

        verify(registryClient, times(1)).configureAuthentication(registryType, entity.connectionData,
                        ARTIFACT_NAME);

    }
}
