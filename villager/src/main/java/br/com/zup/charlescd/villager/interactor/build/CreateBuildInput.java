/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.build;

import br.com.zup.charlescd.villager.api.resources.registry.ComponentRequestPart;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class CreateBuildInput {
    @NotEmpty
    private Set<Module> modules;
    @NotBlank
    private String tagName;
    @NotBlank
    private String callbackUrl;

    private CreateBuildInput(Builder builder) {
        modules = builder.modules;
        tagName = builder.tagName;
        callbackUrl = builder.callbackUrl;
    }

    public Set<Module> getModules() {
        return modules;
    }

    public String getTagName() {
        return tagName;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private Set<Module> modules = new LinkedHashSet<>();
        private String tagName;
        private String callbackUrl;

        private Builder() {
        }

        public Builder withModule(String id, String name, String registryConfigurationId, Set<ComponentRequestPart> components) {
            Module module = new Module(
                    id,
                    name,
                    registryConfigurationId,
                    components.stream().map(
                            c -> new Component(c.getName(), c.getTagName())).collect(Collectors.toSet()
                    )
            );
            modules.add(module);
            return this;
        }

        public Builder withTagName(String val) {
            tagName = val;
            return this;
        }

        public Builder withCallbackUrl(String val) {
            callbackUrl = val;
            return this;
        }

        public CreateBuildInput build() {
            return new CreateBuildInput(this);
        }
    }

    public static class Module {

        private String id;
        private String name;
        private String registryConfigurationId;
        private Set<Component> components;

        Module(String id, String name, String registryConfigurationId, Set<Component> components) {
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

        public String getRegistryConfigurationId() {
            return registryConfigurationId;
        }

        public Set<Component> getComponents() {
            return components;
        }
    }

    public static class Component {

        private String name;
        private String tagName;

        Component(String name, String tagName) {
            this.name = name;
            this.tagName = tagName;
        }

        public String getName() {
            return name;
        }

        public String getTagName() {
            return tagName;
        }
    }
}
