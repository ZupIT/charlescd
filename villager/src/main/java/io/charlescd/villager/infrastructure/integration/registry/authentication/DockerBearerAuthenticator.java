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

package io.charlescd.villager.infrastructure.integration.registry.authentication;

import java.util.Arrays;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;

public final class DockerBearerAuthenticator implements ClientRequestFilter {

    private final String organization;
    private final String username;
    private final String password;
    private final String imageName;
    private final String authUrl;
    private final String service;

    public DockerBearerAuthenticator(String organization,
                                     String username,
                                     String password,
                                     String imageName,
                                     String authUrl,
                                     String service) {
        this.organization = organization;
        this.username = username;
        this.password = password;
        this.imageName = imageName;
        this.authUrl = authUrl;
        this.service = service;
    }

    public String dockerBearerAuthorization() {
        String url = createAuthUrl();

        Client client = ClientBuilder.newClient();

        client.register(new CommonBasicAuthenticator(this.username, this.password));

        DockerBasicAuthResponse response = client.target(url).request().get().readEntity(DockerBasicAuthResponse.class);

        return String.format("Bearer %s", response.getToken());
    }

    @Override
    public void filter(ClientRequestContext clientRequestContext) {
        clientRequestContext.getHeaders().put("Authorization", Arrays.asList(dockerBearerAuthorization()));
    }

    public String createAuthUrl() {
        return new StringBuilder(authUrl)
                .append("?service=")
                .append(service)
                .append("&scope=repository:")
                .append(organization)
                .append("/")
                .append(imageName)
                .append(":pull")
                .toString();
    }
}
