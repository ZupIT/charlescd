package io.charlescd.villager.interactor.registry;

public class GCPDockerRegistryAuth implements DockerRegistryAuth {
    private String organization;
    private String username;
    private String jsonKey;

    public GCPDockerRegistryAuth(String organization, String username, String jsonKey) {
        this.organization = organization;
        this.username = username;
        this.jsonKey = jsonKey;
    }

    public String getOrganization() {
        return organization;
    }

    public String getUsername() {
        return  username;
    }

    public String getJsonKey() {
        return jsonKey;
    }
}
