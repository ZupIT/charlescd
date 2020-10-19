/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.villager.infrastructure.integration.registry;

import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSBasicCredentialsProvider;
import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSCustomProviderChainAuthenticator;
import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import io.charlescd.villager.infrastructure.integration.registry.authentication.DockerBearerAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import java.io.IOException;
import java.util.Optional;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import org.apache.commons.lang.StringUtils;

@RequestScoped
public class DockerRegistryHttpApiV2Client implements RegistryClient {

    private Client client;
    private String baseAddress;

    public DockerRegistryHttpApiV2Client() {
        this.client = ClientBuilder.newClient();
    }

    public void configureAuthentication(RegistryType type,
                                        DockerRegistryConfigurationEntity.DockerRegistryConnectionData config,
                                        String tagName) {
        this.baseAddress = config.address;

        switch (type) {
            case AWS:
                var awsConfig = (DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) config;
                AWSCustomProviderChainAuthenticator providerChain =
                        new AWSCustomProviderChainAuthenticator(awsConfig.region);
                if (StringUtils.isNotEmpty(awsConfig.accessKey) && StringUtils.isNotEmpty(awsConfig.secretKey)) {
                    providerChain.addProviderAsPrimary(
                            new AWSBasicCredentialsProvider(awsConfig.accessKey, awsConfig.secretKey));
                }
                this.client.register(providerChain);
                break;
            case AZURE:
                var azureConfig = (DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData) config;
                this.client.register(new CommonBasicAuthenticator(azureConfig.username, azureConfig.password));
                break;
            case GCP:
                var gcpConfig = (DockerRegistryConfigurationEntity.GCPDockerRegistryConnectionData) config;
                this.client.register(new CommonBasicAuthenticator(gcpConfig.username, gcpConfig.jsonKey));
                break;
            case DOCKER_HUB:
                var dockerHubConfig = (DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData) config;
                this.client.register(
                        new DockerBearerAuthenticator(dockerHubConfig.organization,
                                dockerHubConfig.username,
                                dockerHubConfig.password,
                                tagName,
                                "https://auth.docker.io/token",
                                "registry.docker.io"));
                break;
            default:
                throw new IllegalArgumentException("Registry type is not supported!");
        }
    }

    @Override
    public Optional<Response> getImage(
            String name,
            String tagName,
            DockerRegistryConfigurationEntity.DockerRegistryConnectionData connectionData
    ) {

        String url;
        if (connectionData.organization.isEmpty()) {
            url = createGetImageUrl(this.baseAddress, name, tagName);
        } else {
            url = createGetImageUrl(this.baseAddress, connectionData.organization, name, tagName);
        }

        return Optional.ofNullable(this.client.target(url).request().get());
    }

    private String createGetImageUrl(String baseAddress, String name, String tagName) {

        UriBuilder builder = UriBuilder.fromUri(baseAddress);
        builder.path("/v2/{name}/manifests/{tagName}");

        return builder.build(name, tagName).toString();
    }

    private String createGetImageUrl(String baseAddress, String organization, String name, String tagName) {

        UriBuilder builder = UriBuilder.fromUri(baseAddress);
        builder.path("/v2/{organization}/{name}/manifests/{tagName}");

        return builder.build(organization, name, tagName).toString();
    }

    @Override
    public void close() throws IOException {
        if (this.client != null) {
            this.client.close();
        }
    }

    public void closeQuietly() {
        try {
            close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
