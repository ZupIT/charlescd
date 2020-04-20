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

public class AWSCreateDockerRegistryRequest extends CreateDockerRegistryConfigurationRequest {
    private String accessKey;
    private String secretKey;
    private String region;

    @JsonCreator
    public AWSCreateDockerRegistryRequest(@JsonProperty("name") String name, @JsonProperty("address") String address,
                                          @JsonProperty("accessKey") String accessKey, @JsonProperty("secretKey") String secretKey,
                                          @JsonProperty("region") String region) {
        this.name = name;
        this.address = address;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.region = region;
    }

    @NotEmpty
    public String getAccessKey() {
        return accessKey;
    }

    @NotEmpty
    public String getSecretKey() {
        return secretKey;
    }

    @NotEmpty
    public String getRegion() {
        return region;
    }
}
