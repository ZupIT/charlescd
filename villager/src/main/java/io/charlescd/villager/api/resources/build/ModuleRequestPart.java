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

package io.charlescd.villager.api.resources.build;

import io.charlescd.villager.api.resources.registry.ComponentRequestPart;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

class ModuleRequestPart {

    @NotBlank
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String registryConfigurationId;

    @NotNull
    @NotEmpty
    private Set<ComponentRequestPart> components;

    @JsonCreator
    ModuleRequestPart(@JsonProperty("id") String id,
                      @JsonProperty("name") String name,
                      @JsonProperty("registryConfigurationId") String registryConfigurationId,
                      @JsonProperty("components") Set<ComponentRequestPart> components) {
        this.id = id;
        this.name = name;
        this.components = components;
        this.registryConfigurationId = registryConfigurationId;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<ComponentRequestPart> getComponents() {
        return components;
    }

    public String getRegistryConfigurationId() {
        return registryConfigurationId;
    }
}
