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

package io.charlescd.villager.test;

import io.charlescd.villager.api.handlers.impl.CreateDockerRegistryRequestHandler;
import io.charlescd.villager.api.resources.registry.AWSCreateDockerRegistryRequest;
import io.charlescd.villager.api.resources.registry.AzureCreateDockerRegistryRequest;
import io.charlescd.villager.api.resources.registry.GCPCreateDockerRegistryRequest;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@ExtendWith(MockitoExtension.class)
public class CreateDockerRegistryRequestHandlerTest {

    @Test
    public void createAzureRegistry() {
        var name = "azure-registry";
        var address = "https://url";
        var username = "user";
        var password = "pass";

        var config = new AzureCreateDockerRegistryRequest(name, address, username, password);
        assertThat(config.getName(), is(name));
        assertThat(config.getAddress(), is(address));
        assertThat(config.getUsername(), is(username));
        assertThat(config.getPassword(), is(password));

        var workspaceId = "03232654-a863-4e87-b4d0-5536ad0d119f";

        var handler = new  CreateDockerRegistryRequestHandler(workspaceId, config);

        var result = handler.handle();
        assertThat(result.getName(), is(name));
        assertThat(result.getAddress(), is(address));
        assertThat(result.getRegistryType(), is(RegistryType.AZURE));
        assertThat(result.getWorkspaceId(), is(workspaceId));
    }

    @Test
    public void createAWSRegistry() {
        var name = "aws-registry";
        var address = "https://url";
        var accessKey = "accessKey";
        var secretKey = "secretKey";
        var region = "sa-east-1";

        var config = new AWSCreateDockerRegistryRequest(name, address, accessKey, secretKey, region);
        assertThat(config.getName(), is(name));
        assertThat(config.getAddress(), is(address));
        assertThat(config.getAccessKey(), is(accessKey));
        assertThat(config.getSecretKey(), is(secretKey));
        assertThat(config.getRegion(), is(region));

        var workspaceId = "03232654-a863-4e87-b4d0-5536ad0d119f";

        var handler = new  CreateDockerRegistryRequestHandler(workspaceId, config);

        var result = handler.handle();
        assertThat(result.getName(), is(name));
        assertThat(result.getAddress(), is(address));
        assertThat(result.getRegistryType(), is(RegistryType.AWS));
        assertThat(result.getWorkspaceId(), is(workspaceId));
    }

    @Test
    public void createGCPRegistry() {
        var name = "gcp-registry";
        var address = "https://url";
        var organization = "org";
        var username = "_json_key";
        var jsonKey = "key";

        var config = new GCPCreateDockerRegistryRequest(name, address, organization, username, jsonKey);
        assertThat(config.getName(), is(name));
        assertThat(config.getAddress(), is(address));
        assertThat(config.getOrganization(), is(organization));
        assertThat(config.getUsername(), is(username));
        assertThat(config.getJsonKey(), is(jsonKey));

        var workspaceId = "03232654-a863-4e87-b4d0-5536ad0d119f";

        var handler = new  CreateDockerRegistryRequestHandler(workspaceId, config);

        var result = handler.handle();
        assertThat(result.getName(), is(name));
        assertThat(result.getAddress(), is(address));
        assertThat(result.getRegistryType(), is(RegistryType.GCP));
        assertThat(result.getWorkspaceId(), is(workspaceId));
    }
}