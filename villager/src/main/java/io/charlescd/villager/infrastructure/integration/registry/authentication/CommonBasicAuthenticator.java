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

package io.charlescd.villager.infrastructure.integration.registry.authentication;

import java.util.Base64;

public final class CommonBasicAuthenticator extends AbstractBasicAuthenticator {

    private final String username;
    private final String password;

    public CommonBasicAuthenticator(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String loadBasicAuthorization() {
        byte[] bytes = String.format("%s:%s", this.username, this.password).getBytes();
        String token = Base64.getEncoder().encodeToString(bytes);

        return String.format("Basic %s", token);
    }

}
