package io.charlescd.villager.test;

import io.charlescd.villager.infrastructure.integration.registry.authentication.DockerBearerAuthenticator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@ExtendWith(MockitoExtension.class)
public class DockerBearerAuthenticatorTest {
    @Test
    public void testCreateAuthUrl() {
        var organization = "org";
        var username = "user";
        var password = "pass";
        var tagName = "latest";
        var authUrl = "https://auth.docker.io";
        var service = "registry.docker.io";

        var auth = new DockerBearerAuthenticator(organization, username, password, tagName, authUrl, service);

        assertThat(auth.createAuthUrl(), is("https://auth.docker.io?service=registry.docker.io&scope=repository:org/latest:pull"));
    }
}
