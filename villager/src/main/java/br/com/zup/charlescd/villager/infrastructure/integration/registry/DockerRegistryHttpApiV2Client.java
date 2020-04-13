/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.registry;

import br.com.zup.charlescd.villager.infrastructure.integration.registry.authentication.AWSBasicAuthenticator;
import br.com.zup.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.util.Optional;

@ApplicationScoped
public class DockerRegistryHttpApiV2Client implements RegistryClient {

    private Client client;
    private String baseAddress;

    public DockerRegistryHttpApiV2Client() {
        this.client = ClientBuilder.newClient();
    }

    public void configureAuthentication(RegistryType type, DockerRegistryConfigurationEntity.DockerRegistryConnectionData config) {
        this.baseAddress = config.address;
        switch (type) {
            case AWS:
                var awsConfig = (DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData) config;
                this.client.register(new AWSBasicAuthenticator(awsConfig.region, awsConfig.accessKey, awsConfig.secretKey));
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
