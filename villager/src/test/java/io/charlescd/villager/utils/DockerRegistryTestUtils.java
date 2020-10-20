package io.charlescd.villager.utils;

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.interactor.registry.*;

import java.time.LocalDateTime;

public class DockerRegistryTestUtils {

    private static final String ADDRESS = "https://registry.io.com";
    private static final String STRING_DEFAULT_VALUE = "charlescd";
    private static final String ID_DEFAULT_VALUE = "1a3d413d-2255-4a1b-94ba-82e7366e4342";

    public static DockerRegistryConfigurationEntity generateDockerRegistryConfigurationEntity(RegistryType registryType, DockerRegistryConfigurationEntity.DockerRegistryConnectionData connectionData) {
        var entity = new DockerRegistryConfigurationEntity();
        entity.id = ID_DEFAULT_VALUE;
        entity.name = "Testing";
        entity.type = registryType;
        entity.workspaceId = "1a3d413d-2255-4a1b-94ba-82e7366e4342";
        entity.createdAt = LocalDateTime.now();
        entity.connectionData = connectionData;
        return entity;
    }

    public static TestDockerRegistryConnectionInput generateTestDockerRegistryConnectionInput(RegistryType registryType) {
        return  TestDockerRegistryConnectionInput.builder()
                .withWorkspaceId(ID_DEFAULT_VALUE)
                .withRegistryConfigurationId(ID_DEFAULT_VALUE)
                .withRegistryType(registryType)
                .build();
    }

    public static DockerRegistryConfigurationEntity.DockerRegistryConnectionData getConnectionData(RegistryType registryType) {

        DockerRegistryConfigurationEntity.DockerRegistryConnectionData connectionData;

        switch (registryType) {
            case AWS:
                connectionData =
                        new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(
                                ADDRESS,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            case AZURE:
                connectionData =
                        new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData(
                                ADDRESS,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            case GCP:

                connectionData =
                        new DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData(
                                ADDRESS,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            case DOCKER_HUB:
                connectionData =
                        new DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData(
                                ADDRESS,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            default:
                throw new IllegalStateException("Registry type not supported!");


        }
        return connectionData;
    }

    public static DockerRegistryConfigurationInput generateDockerRegistryConfigurationInput(RegistryType registryType) {
        return  DockerRegistryConfigurationInput.builder()
                .withWorkspaceId(ID_DEFAULT_VALUE)
                .withName(STRING_DEFAULT_VALUE)
                .withAuthorId(ID_DEFAULT_VALUE)
                .withAddress(ADDRESS)
                .withRegistryType(registryType)
                .withAuth(getRegistryAuth(registryType))
                .build();
    }

    private static DockerRegistryAuth getRegistryAuth(RegistryType registryType) {

        DockerRegistryAuth registryAuth;

        switch (registryType) {
            case AWS:
                registryAuth =
                        new AWSDockerRegistryAuth(
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            case AZURE:
                registryAuth =
                        new AzureDockerRegistryAuth(
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            case GCP:
                registryAuth =
                        new GCPDockerRegistryAuth(
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            case DOCKER_HUB:
                registryAuth =
                        new DockerHubDockerRegistryAuth(
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE,
                                STRING_DEFAULT_VALUE);
                break;
            default:
                throw new IllegalStateException("Registry type not supported!");


        }
        return registryAuth;
    }
}
