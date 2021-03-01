package io.charlescd.villager.infrastructure.integration.registry.configuration;

import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

public final class HarborConfig {

    private HarborConfig() {}

    public static Object execute(ConfigParameters config) {
        var harborConfig =
                (DockerRegistryConfigurationEntity.HarborDockerRegistryConnectionData) config.getConfiguration();
        return new CommonBasicAuthenticator(harborConfig.username, harborConfig.password);
    }
}
