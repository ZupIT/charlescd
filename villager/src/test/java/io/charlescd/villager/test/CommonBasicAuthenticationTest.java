package io.charlescd.villager.test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import org.junit.jupiter.api.Test;

import io.charlescd.villager.infrastructure.integration.registry.authentication.CommonBasicAuthenticator;

public class CommonBasicAuthenticationTest {

    @Test
    public void testCreateBasicToken() {
      final var username = "exampleUsername";
      final var password = "examplePassword";
      final var authentication = new CommonBasicAuthenticator(username, password).loadBasicAuthorization();

      assertThat(authentication, is("Basic ZXhhbXBsZVVzZXJuYW1lOmV4YW1wbGVQYXNzd29yZA=="));
    }
}