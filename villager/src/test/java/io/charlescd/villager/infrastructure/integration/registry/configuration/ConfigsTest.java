package io.charlescd.villager.infrastructure.integration.registry.configuration;

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import org.junit.jupiter.api.Test;

import java.util.UUID;

class ConfigsTest {

    @Test
    void whenConfigureAwsWithAuthProviderShouldBeSuccessfullConfigured() {
        //GIVEn
        final String address = "127.0.0.1";
        final String accessKey = UUID.randomUUID().toString();
        final String secretKey = UUID.randomUUID().toString();
        final String region = "us-east-1";
        var data = new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(address, accessKey, secretKey, region);
        var configParameters = new ConfigParameters(data, "tagName");

        //WHEN
        RegistryType.AWS.configure(configParameters);
    }

    @Test
    void whenConfigureAwsWithoutAuthProviderShouldBeSuccessfullConfigured() {
        //GIVEN
        final String address = "127.0.0.1";
        final String accessKey = "";
        final String secretKey = "";
        final String region = "us-east-1";
        var data = new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(address, accessKey, secretKey, region);
        var configParameters = new ConfigParameters(data, "tagName");

        //WHEN
        RegistryType.AWS.configure(configParameters);
    }

    @Test
    void whenConfigureAzureWithAuthProviderShouldBeSuccessfullConfigured() {
        //GIVEn
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String password = "testepass";
        var data = new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData(address, userName, password);
        var configParameters = new ConfigParameters(data, "tagName");

        //WHEN
        RegistryType.AZURE.configure(configParameters);
    }

    @Test
    void whenConfigureHarborWithAuthProviderShouldBeSuccessfullConfigured() {
        //GIVEn
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String password = "testepass";
        var data = new DockerRegistryConfigurationEntity.HarborDockerRegistryConnectionData(address, userName, password);
        var configParameters = new ConfigParameters(data, "tagName");


        //WHEN
        RegistryType.HARBOR.configure(configParameters);
    }

    @Test
    void whenConfigureGCPWithAuthProviderShouldBeSuccessfullConfigured() {
        //GIVEn
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String organization = "Zup";
        final String jsonKey = "{ \"teste\": \"token\"}";
        var data = new DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData(address, organization, userName, jsonKey);
        var configParameters = new ConfigParameters(data, "tagName");


        //WHEN
        RegistryType.GCP.configure(configParameters);
    }

    @Test
    void whenConfigureDockerHubWithAuthProviderShouldBeSuccessfullConfigured() {
        //GIVEn
        final String address = "127.0.0.1";
        final String userName = "teste";
        final String organization = "Zup";
        final String password = "password";
        var data = new DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData(address, organization, userName, password);
        var configParameters = new ConfigParameters(data, "tagName");


        //WHEN
        RegistryType.DOCKER_HUB.configure(configParameters);
    }
}