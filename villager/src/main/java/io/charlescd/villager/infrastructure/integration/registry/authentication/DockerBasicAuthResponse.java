package io.charlescd.villager.infrastructure.integration.registry.authentication;


import com.fasterxml.jackson.annotation.JsonProperty;

public class DockerBasicAuthResponse {
    public String token;
    @JsonProperty("access_token")
    public String accessToken;
    @JsonProperty("expires_in")
    public Integer expiresIn;
    @JsonProperty("issued_at")
    public String issuedAt;

    public DockerBasicAuthResponse() { }
}
