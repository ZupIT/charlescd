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

package br.com.zup.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class AzureCreateDockerRegistryRequest extends CreateDockerRegistryConfigurationRequest {
    private String username;
    private String password;

    @JsonCreator
    public AzureCreateDockerRegistryRequest(@JsonProperty("name") String name, @JsonProperty("address") String address,
                                            @JsonProperty("username") String username, @JsonProperty("password") String password) {
        this.name = name;
        this.address = address;
        this.username = username;
        this.password = password;
    }

    @NotEmpty
    public String getUsername() {
        return username;
    }

    @NotEmpty
    public String getPassword() {
        return password;
    }
}
