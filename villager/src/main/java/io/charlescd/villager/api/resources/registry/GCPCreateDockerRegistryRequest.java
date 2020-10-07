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

package io.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotEmpty;

public class GCPCreateDockerRegistryRequest extends CreateDockerRegistryConfigurationRequest {
    private String organization;
    private String username;
    private String jsonKey;

    @JsonCreator
    public GCPCreateDockerRegistryRequest(@JsonProperty("name") String name,
                                          @JsonProperty("address") String address,
                                          @JsonProperty("organization") String organization,
                                          @JsonProperty("username") String username,
                                          @JsonProperty("jsonKey") String jsonKey) {
        this.name = name;
        this.address = address;
        this.organization = organization;
        this.username = username;
        this.jsonKey = jsonKey;
    }

    @NotEmpty
    public String getOrganization() {
        return organization;
    }

    @NotEmpty
    public String getUsername() {
        return username;
    }

    @NotEmpty
    public String getJsonKey() {
        return jsonKey;
    }
}