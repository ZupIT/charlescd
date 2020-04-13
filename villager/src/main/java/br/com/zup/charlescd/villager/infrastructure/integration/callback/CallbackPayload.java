/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.callback;

import java.util.HashSet;
import java.util.Set;

public class CallbackPayload {

    private BuildStatus status;
    private Set<ModulePart> modules = new HashSet<>();

    public CallbackPayload(BuildStatus status) {
        this.status = status;
    }

    public CallbackPayload(String status) {
        this.status = BuildStatus.of(status);
    }

    public void addModule(ModulePart module) {
        this.modules.add(module);
    }

    public BuildStatus getStatus() {
        return status;
    }

    public Set<ModulePart> getModules() {
        return modules;
    }

    public static class ModulePart {
        private String moduleId;
        private Set<ComponentPart> components;
        private BuildStatus status;

        private ModulePart(Builder builder) {
            moduleId = builder.moduleId;
            components = builder.components;
            status = BuildStatus.valueOf(builder.status);
        }

        public String getModuleId() {
            return moduleId;
        }

        public Set<ComponentPart> getComponents() {
            return components;
        }

        public BuildStatus getStatus() {
            return status;
        }

        public static Builder newBuilder() {
            return new Builder();
        }

        public static final class Builder {
            private String moduleId;
            private Set<ComponentPart> components = new HashSet<>();
            private String status;

            private Builder() {
            }

            public Builder withModuleId(String val) {
                moduleId = val;
                return this;
            }

            public Builder withComponent(ComponentPart val) {
                components.add(val);
                return this;
            }

            public Builder withComponents(Set<ComponentPart> val) {
                components = val;
                return this;
            }

            public Builder withStatus(String val) {
                status = val;
                return this;
            }

            public ModulePart build() {
                return new ModulePart(this);
            }
        }
    }

    public static  class ComponentPart{

        private String name;
        private String tagName;

        private ComponentPart(Builder builder) {
            setName(builder.name);
            setTagName(builder.tagName);
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getTagName() {
            return tagName;
        }

        public void setTagName(String tagName) {
            this.tagName = tagName;
        }

        public static final class Builder {
            private String name;
            private String tagName;

            public Builder() {
            }

            public Builder withName(String val) {
                name = val;
                return this;
            }

            public Builder withTagName(String val) {
                tagName = val;
                return this;
            }

            public ComponentPart build() {
                return new ComponentPart(this);
            }
        }
    }

    public enum BuildStatus {
        SUCCESS, TIME_OUT;

        public static BuildStatus of(String status){
            if (br.com.zup.charlescd.villager.infrastructure.persistence.BuildStatus.SUCCESS.name().equals(status)){
                return BuildStatus.SUCCESS;
            }

            return BuildStatus.TIME_OUT;
        }
    }


}
