package io.charlescd.villager.infrastructure.integration.registry.configuration;

import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSBasicCredentialsProvider;
import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSCustomProviderChainAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import org.apache.commons.lang.StringUtils;

public final class AwsConfig {

    private AwsConfig() {}

    public static Object execute(ConfigParameters config) {
        var awsConfig =
                (DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) config.getConfiguration();
        AWSCustomProviderChainAuthenticator providerChain =
                new AWSCustomProviderChainAuthenticator(awsConfig.region);
        if (StringUtils.isNotEmpty(awsConfig.accessKey) && StringUtils.isNotEmpty(awsConfig.secretKey)) {
            providerChain.addProviderAsPrimary(
                    new AWSBasicCredentialsProvider(awsConfig.accessKey, awsConfig.secretKey));
        }
        return providerChain;
    }
}
