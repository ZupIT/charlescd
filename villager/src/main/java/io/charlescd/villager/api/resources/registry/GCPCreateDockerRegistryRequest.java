package io.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class GCPCreateDockerRegistryRequest extends CreateDockerRegistryConfigurationRequest {
    private String organization;
    private String username;
    private String jsonKey;

    @JsonCreator
    public GCPCreateDockerRegistryRequest(@JsonProperty("name") String name,
                                          @JsonProperty("address") String address,
                                          @JsonProperty("organization") String organization,
                                          @JsonProperty("jsonKey") String jsonKey) {
        this.name = name;
        this.address = address;
        this.organization = organization;
        this.username = "_json_key";
        this.jsonKey = jsonKey;
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
    public String getJsonKey() {
        return jsonKey;
    }
}
