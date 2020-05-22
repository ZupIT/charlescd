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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.hibernate.validator.constraints.URL;

import javax.validation.constraints.NotEmpty;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "provider"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = AzureCreateDockerRegistryRequest.class, name = "Azure"),
        @JsonSubTypes.Type(value = AWSCreateDockerRegistryRequest.class, name = "AWS")
})
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class CreateDockerRegistryConfigurationRequest {

    @NotEmpty
    protected String name;
    @URL
    @NotEmpty
    protected String address;

    @NotEmpty
    protected String authorId;

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getAuthorId() {
        return authorId;
    }

}
