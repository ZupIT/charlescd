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

import com.fasterxml.jackson.annotation.JsonProperty;

public class DockerBasicAuthResponse {
    private String token;
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("expires_in")
    private Integer expiresIn;
    @JsonProperty("issued_at")
    private String issuedAt;

    public DockerBasicAuthResponse(String token, String accessToken, Integer expiresIn, String issuedAt) {
        this.token = token;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.issuedAt = issuedAt;
    }

    public String getToken() {
        return token;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public Integer getExpiresIn() {
        return expiresIn;
    }

    public String getIssuedAt() {
        return issuedAt;
    }
}