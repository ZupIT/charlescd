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