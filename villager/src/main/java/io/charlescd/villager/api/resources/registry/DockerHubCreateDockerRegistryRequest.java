package io.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class DockerHubCreateDockerRegistryRequest extends CreateDockerRegistryConfigurationRequest {
    private String organization;
    private String username;
    private String password;

    @JsonCreator
    public DockerHubCreateDockerRegistryRequest(@JsonProperty("name") String name,
                                                @JsonProperty("address") String address,
                                                @JsonProperty("username") String username,
                                                @JsonProperty("password") String password) {
        this.name = name;
        this.address = address;
        this.organization = username;
        this.username = username;
        this.password = password;
    }

    @NotEmpty
    public String getOrganization() {
        return organization;
    }

    @NotEmpty
    public String getUsername() {
        return username;
    }

    @NotEmpty
    public String getPassword() {
        return password;
    }
}
