package io.charlescd.villager.interactor.registry;

public class DockerHubDockerRegistryAuth implements DockerRegistryAuth {
    private String organization;
    private String username;
    private String password;

    public DockerHubDockerRegistryAuth(String organization, String username, String password) {
        this.organization = organization;
        this.username = username;
        this.password = password;
    }

    public String getOrganization() {
        return organization;
    }

    public String getUsername() {
        return  username;
    }

    public String getPassword() {
        return password;
    }
}
