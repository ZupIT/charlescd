package io.charlescd.villager.infrastructure.integration.registry.configuration;

import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

public final class GcpConfig {

    private GcpConfig() {}

    public static Object execute(ConfigParameters config) {
        var gcpConfig =
                (DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData) config.getConfiguration();
        return new CommonBasicAuthenticator(gcpConfig.username, gcpConfig.jsonKey);
    }
}
