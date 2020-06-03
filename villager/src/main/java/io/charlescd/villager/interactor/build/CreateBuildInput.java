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

package io.charlescd.villager.interactor.build;

import io.charlescd.villager.api.resources.registry.ComponentRequestPart;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

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

        public Builder withModule(String id, String name, String registryConfigurationId,
                                  Set<ComponentRequestPart> components) {
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
