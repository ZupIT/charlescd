package io.charlescd.villager.infrastructure.integration.registry.configuraton;

import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

public class GcpConfig {

    public static Object execute(ConfigParameters config) {
        var gcpConfig = (DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData) config.getConfiguration();
        return new CommonBasicAuthenticator(gcpConfig.username, gcpConfig.jsonKey);
    }
}
