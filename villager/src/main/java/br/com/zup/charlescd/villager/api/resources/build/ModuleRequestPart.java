/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.build;

import br.com.zup.charlescd.villager.api.resources.registry.ComponentRequestPart;
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
