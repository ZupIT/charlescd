package io.charlescd.villager.infrastructure.integration.registry.configuration;

import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

public class ConfigParameters {

    private final DockerRegistryConfigurationEntity.DockerRegistryConnectionData configuration;
    private final String tagName;

    public ConfigParameters(DockerRegistryConfigurationEntity.DockerRegistryConnectionData configuration,
                            String tagName) {
        this.configuration = configuration;
        this.tagName = tagName;
    }

    public DockerRegistryConfigurationEntity.DockerRegistryConnectionData getConfiguration() {
        return configuration;
    }

    public String getTagName() {
        return tagName;
    }
}
