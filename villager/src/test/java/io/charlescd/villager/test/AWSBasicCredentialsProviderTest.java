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

    @Test
    public void testRefreshBasicCredentials() {
      final var accessKey = "AYSGAJSHAGSJAHS";
      final var secretKey = "DKLJHFfdLKDSJFHLKDSJFHLKSDJF";
      final var authenticationProvider = new AWSBasicCredentialsProvider(accessKey, secretKey);
      final var authentication = authenticationProvider.getCredentials();
      // updates credentials, in some implementations this method must be called from time to time. In this specific implementation, refresh has no use.
      authenticationProvider.refresh();

      assertThat(authentication.getAWSAccessKeyId(), is(accessKey));
      assertThat(authentication.getAWSSecretKey(), is(secretKey));
    }
}