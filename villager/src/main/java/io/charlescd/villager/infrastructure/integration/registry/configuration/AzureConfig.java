package io.charlescd.villager.infrastructure.integration.registry.configuration;

import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

public class AzureConfig {

    public static Object execute(ConfigParameters config) {
        var azureConfig =
                (DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData) config.getConfiguration();
        return new CommonBasicAuthenticator(azureConfig.username, azureConfig.password);
    }
}
