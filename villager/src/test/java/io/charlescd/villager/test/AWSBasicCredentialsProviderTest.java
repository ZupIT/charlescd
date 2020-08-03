package io.charlescd.villager.test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import org.junit.jupiter.api.Test;

import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSBasicCredentialsProvider;

public class AWSBasicCredentialsProviderTest {
  
    @Test
    public void testCreateBasicCredentials() {
      final var accessKey = "AYSGAJSHAGSJAHS";
      final var secretKey = "DKLJHFfdLKDSJFHLKDSJFHLKSDJF";
      final var authentication = new AWSBasicCredentialsProvider(accessKey, secretKey).getCredentials();

      assertThat(authentication.getAWSAccessKeyId(), is(accessKey));
      assertThat(authentication.getAWSSecretKey(), is(secretKey));
    }
}