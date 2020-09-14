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
        var jsonKey = "key";

        var config = new GCPCreateDockerRegistryRequest(name, address, organization, jsonKey);
        assertThat(config.getName(), is(name));
        assertThat(config.getAddress(), is(address));
        assertThat(config.getOrganization(), is(organization));
        assertThat(config.getUsername(), is("_json_key"));
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
