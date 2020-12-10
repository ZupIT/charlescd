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

package io.charlescd.villager.interactor.registry;

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;

public class TestDockerRegistryConnectionInput {
    private String workspaceId;
    private String registryConfigurationId;
    private RegistryType registryType;

    private TestDockerRegistryConnectionInput(String workspaceId,
                                              String registryConfigurationId, RegistryType registryType) {
        this.workspaceId = workspaceId;
        this.registryConfigurationId = registryConfigurationId;
        this.registryType = registryType;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public String getRegistryConfigurationId() {
        return registryConfigurationId;
    }

    public RegistryType getRegistryType() {
        return registryType;
    }

    public static TestDockerRegistryConnectionBuilder builder() {
        return TestDockerRegistryConnectionBuilder.newBuilder();
    }

    public static final class TestDockerRegistryConnectionBuilder {

        private String workspaceId;
        private String registryConfigurationId;
        private RegistryType registryType;

        private TestDockerRegistryConnectionBuilder() {
        }

        private static TestDockerRegistryConnectionBuilder newBuilder() {
            return new TestDockerRegistryConnectionBuilder();
        }

        public TestDockerRegistryConnectionBuilder withWorkspaceId(String workspaceId) {
            this.workspaceId = workspaceId;
            return this;
        }

        public TestDockerRegistryConnectionBuilder withRegistryConfigurationId(
                String registryConfigurationId) {
            this.registryConfigurationId = registryConfigurationId;
            return this;
        }

        public TestDockerRegistryConnectionBuilder withRegistryType(RegistryType registryType) {
            this.registryType = registryType;
            return this;
        }

        public TestDockerRegistryConnectionInput build() {
            return new TestDockerRegistryConnectionInput(workspaceId, registryConfigurationId, registryType);
        }
    }
}
