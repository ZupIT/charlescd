package io.charlescd.villager.infrastructure.integration.registry.configuraton;

import io.charlescd.villager.infrastructure.integration.registry.authentication.DockerBearerAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

public class DockerHubConfig {

    public static Object execute(ConfigParameters config) {
        var dockerHubConfig =
                (DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData) config.getConfiguration();
        return new DockerBearerAuthenticator(dockerHubConfig.organization,
                        dockerHubConfig.username,
                        dockerHubConfig.password,
                        config.getTagName(),
                        "https://auth.docker.io/token",
                        "registry.docker.io");
    }
}
