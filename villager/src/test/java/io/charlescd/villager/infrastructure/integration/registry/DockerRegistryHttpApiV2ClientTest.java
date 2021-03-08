package io.charlescd.villager.infrastructure.integration.registry;

import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.UUID;

import static org.mockito.Mockito.mock;

class DockerRegistryHttpApiV2ClientTest {

    private DockerRegistryHttpApiV2Client dockerRegistry;

    @BeforeEach
    void setUp() {
        dockerRegistry = new DockerRegistryHttpApiV2Client(false);

    }

    @Test
    void whenConfigureAwsAuthenticationShouldBeSuccessfullConfigured() {
        //GIVEN
        final String address = "127.0.0.1";
        final String accessKey = UUID.randomUUID().toString();
        final String secretKey = UUID.randomUUID().toString();
        final String region = "us-east-1";
        var data = new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(address, accessKey, secretKey, region);
        RegistryType regitryType = RegistryType.AWS;

        //WHEN


        dockerRegistry.configureAuthentication(regitryType, data, "");
    }

    @Test
    void whenConfigureAzureAuthenticationShouldBeSuccessfullConfigured() {
        //GIVEN
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String password = "testepass";
        var data = new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData(address, userName, password);
        RegistryType regitryType = RegistryType.AZURE;

        //WHEN
        dockerRegistry.configureAuthentication(regitryType, data, "");
    }

    @Test
    void whenConfigureHarborAuthenticationShouldBeSuccessfullConfigured() {
        //GIVEN
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String password = "testepass";
        var data = new DockerRegistryConfigurationEntity.HarborDockerRegistryConnectionData(address, userName, password);
        RegistryType regitryType = RegistryType.HARBOR;

        //WHEN
        dockerRegistry.configureAuthentication(regitryType, data, "");
    }

    @Test
    void whenConfigureGcpAuthenticationShouldBeSuccessfullConfigured() {
        //GIVEN
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String organization = "Zup";
        final String jsonKey = "{ \"teste\": \"token\"}";
        var data = new DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData(address, organization, userName, jsonKey);
        RegistryType regitryType = RegistryType.GCP;

        //WHEN
        dockerRegistry.configureAuthentication(regitryType, data, "");
    }

    @Test
    void whenConfigureDockerHubAuthenticationShouldBeSuccessfullConfigured() {
        //GIVEN
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String organization = "Zup";
        final String password = "password";
        var data = new DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData(address, organization, userName, password);
        RegistryType regitryType = RegistryType.DOCKER_HUB;

        //WHEN
        dockerRegistry.configureAuthentication(regitryType, data, "");
    }

    @Test
    void whenConfigureUndefinedAuthenticationShouldBeThrowException() {
        //GIVEN
        var data=
                mock(DockerRegistryConfigurationEntity.DockerRegistryConnectionData.class);
        RegistryType regitryType = RegistryType.UNSUPPORTED;

        //WHEN
        Assertions.assertThrows(IllegalArgumentException.class, () -> dockerRegistry.configureAuthentication(regitryType, data, ""));
    }

    @Test
    void whenGetImageAndCredentialsIsInvalidShouldBeThrowException() {
        //GIVEN
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String organization = "Zup";
        final String password = "password";
        var data = new DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData(address, organization, userName, password);
        RegistryType regitryType = RegistryType.DOCKER_HUB;

        //WHEN

        dockerRegistry.configureAuthentication(regitryType, data, "tagName");
        Assertions.assertThrows(Exception.class, () -> dockerRegistry.getImage("name", "tagName", data));
    }

    @Test
    void whenGetImageWithOrganizationEmptyAndCredentialsIsInvalidShouldBeThrowException() {
        //GIVEN
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String organization = "";
        final String password = "password";
        var data = new DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData(address, organization, userName, password);
        RegistryType regitryType = RegistryType.DOCKER_HUB;

        //WHEN

        dockerRegistry.configureAuthentication(regitryType, data, "tagName");
        Assertions.assertThrows(Exception.class, () -> dockerRegistry.getImage("name", "tagName", data));
    }

    @Test
    void whenGetPathAndCredentialsIsInvalidShouldBeThrowException() {
        //GIVEN
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String organization = "Zup";
        final String password = "password";
        var data = new DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData(address, organization, userName, password);
        RegistryType regitryType = RegistryType.DOCKER_HUB;

        //WHEN
        dockerRegistry.configureAuthentication(regitryType, data, "tagName");
        Assertions.assertThrows(Exception.class, () -> dockerRegistry.getV2Path(data));

    }

    @Test
    void whenConfigureIgnoringSSLShouldBeSuccessful() {
        //GIVEN
        final String address = "127.0.0.1";
        final String accessKey = UUID.randomUUID().toString();
        final String secretKey = UUID.randomUUID().toString();
        final String region = "us-east-1";
        var data = new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(address, accessKey, secretKey, region);
        RegistryType regitryType = RegistryType.AWS;
        var dockerRegistryIgnoreSSl = new DockerRegistryHttpApiV2Client(false);
        //WHEN

        dockerRegistryIgnoreSSl.configureAuthentication(regitryType, data, "");
    }
}