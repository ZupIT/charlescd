package io.charlescd.villager.infrastructure.integration.registry;

import io.charlescd.villager.infrastructure.integration.registry.configuraton.AwsConfig;
import io.charlescd.villager.infrastructure.integration.registry.configuraton.ConfigParameters;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class DockerRegistryHttpApiV2ClientTest {

    private DockerRegistryHttpApiV2Client dockerRegistry;

    @BeforeEach
    void setUp() {
        dockerRegistry = new DockerRegistryHttpApiV2Client();
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
    void getImage() {
    }

    @Test
    void close() {
    }

    @Test
    void closeQuietly() {
    }
}