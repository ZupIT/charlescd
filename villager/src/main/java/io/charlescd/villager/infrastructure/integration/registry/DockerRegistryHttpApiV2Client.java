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

import com.fasterxml.jackson.databind.ObjectMapper;
import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSBasicAuthenticator;
import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import java.io.IOException;
import java.util.Optional;
import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

@ApplicationScoped
public class DockerRegistryHttpApiV2Client implements RegistryClient {

    private Client client;
    private String baseAddress;

    public DockerRegistryHttpApiV2Client() {
        this.client = ClientBuilder.newClient();
    }

    public void configureAuthentication(RegistryType type,
                                        DockerRegistryConfigurationEntity.DockerRegistryConnectionData config) {
        this.baseAddress = config.address;
        switch (type) {
            case AWS:
                var awsConfig = (DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) config;
                this.client
                        .register(
                                new AWSBasicAuthenticator(awsConfig.region, awsConfig.accessKey, awsConfig.secretKey));
                break;
            case AZURE:
                var azureConfig = (DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData) config;
                this.client.register(new CommonBasicAuthenticator(azureConfig.username, azureConfig.password));
                break;
            default:
                throw new IllegalArgumentException("Registry type is not supported!");
        }
    }

    @Override
    public Optional<Response> getImage(String name, String tagName) {

        String url = createGetImageUrl(this.baseAddress, name, tagName);

        return Optional.ofNullable(this.client.target(url).request().get());

    }

    private String createGetImageUrl(String baseAddress, String name, String tagName) {

        UriBuilder builder = UriBuilder.fromUri(baseAddress);
        builder.path("/v2/{name}/manifests/{tagName}");

        return builder.build(name, tagName).toString();
    }

    @Override
    public TagsResponse listImageTags(String name, Integer max, String last) throws IOException {

        String url = createListImageTagsUrl(this.baseAddress, name, max, last);

        Response response = this.client.target(url).request().get();

        if (response == null || response.getStatus() == 404) {
            return null;
        }

        // due to aws API return "text/plain" in content-type header
        if (response.getMediaType().isCompatible(MediaType.TEXT_PLAIN_TYPE)) {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response.readEntity(String.class), TagsResponse.class);
        }

        return response.readEntity(TagsResponse.class);
    }

    private String createListImageTagsUrl(String baseAddress, String name, Integer max, String last) {

        UriBuilder builder = UriBuilder.fromUri(baseAddress);
        builder.path("/v2/{name}/tags/list");

        if (max != null) {
            builder.queryParam("n", max);
        }

        if (last != null) {
            builder.queryParam("last", last);
        }

        return builder.build(name).toString();
    }
}
