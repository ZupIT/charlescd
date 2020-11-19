package io.charlescd.villager.infrastructure.integration.registry.configuraton;

import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

public class HarborConfig {

    public static Object execute(ConfigParameters config) {
        var harborConfig = (DockerRegistryConfigurationEntity.HarborDockerRegistryConnectionData) config.getConfiguration();
        return new CommonBasicAuthenticator(harborConfig.username, harborConfig.password);
    }
}
