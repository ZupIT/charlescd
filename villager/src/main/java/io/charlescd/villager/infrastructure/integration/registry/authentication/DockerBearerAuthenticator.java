package io.charlescd.villager.infrastructure.integration.registry.authentication;


import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import java.util.Arrays;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;

public final class DockerBearerAuthenticator implements ClientRequestFilter {

    private final DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData config;
    private final String tagName;
    private final String authUrl;
    private final String service;

    public DockerBearerAuthenticator(DockerRegistryConfigurationEntity.DockerHubDockerRegistryConnectionData config,
                                     String tagName,
                                     String authUrl,
                                     String service) {
        this.config = config;
        this.tagName = tagName;
        this.authUrl = authUrl;
        this.service = service;
    }

    public String dockerBearerAuthorization() {
        String url = new StringBuilder(authUrl)
                .append("?service=")
                .append(service)
                .append("&scope=repository:")
                .append(config.organization)
                .append("/")
                .append(tagName)
                .append(":pull")
                .toString();

        Client client = ClientBuilder.newClient();

        client.register(new CommonBasicAuthenticator(this.config.username, this.config.password));

        DockerBasicAuthResponse response = client.target(url).request().get().readEntity(DockerBasicAuthResponse.class);

        return String.format("Bearer %s", response.token);
    }

    @Override
    public void filter(ClientRequestContext clientRequestContext) {
        clientRequestContext.getHeaders().put("Authorization", Arrays.asList(dockerBearerAuthorization()));
    }
}
