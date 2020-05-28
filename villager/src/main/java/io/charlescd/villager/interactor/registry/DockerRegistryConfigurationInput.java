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

public class DockerRegistryConfigurationInput {
    private String name;
    private String address;
    private RegistryType registryType;
    private DockerRegistryAuth auth;
    private String workspaceId;
    private String authorId;

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public RegistryType getRegistryType() {
        return registryType;
    }

    public DockerRegistryAuth getAuth() {
        return auth;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public static RegistryConfigurationInputBuilder builder() {
        return RegistryConfigurationInputBuilder.newBuilder();
    }

    public static final class RegistryConfigurationInputBuilder {
        private String name;
        private String address;
        private RegistryType registryType;
        private DockerRegistryAuth auth;
        private String workspaceId;
        private String authorId;

        private RegistryConfigurationInputBuilder() {
        }

        private static RegistryConfigurationInputBuilder newBuilder() {
            return new RegistryConfigurationInputBuilder();
        }

        public RegistryConfigurationInputBuilder withName(String name) {
            this.name = name;
            return this;
        }

        public RegistryConfigurationInputBuilder withAddress(String address) {
            this.address = address;
            return this;
        }

        public RegistryConfigurationInputBuilder withRegistryType(RegistryType registryType) {
            this.registryType = registryType;
            return this;
        }

        public RegistryConfigurationInputBuilder withAuth(DockerRegistryAuth auth) {
            this.auth = auth;
            return this;
        }

        public RegistryConfigurationInputBuilder withWorkspaceId(String workspaceId) {
            this.workspaceId = workspaceId;
            return this;
        }

        public RegistryConfigurationInputBuilder withAuthorId(String authorId) {
            this.authorId = authorId;
            return this;
        }

        public DockerRegistryConfigurationInput build() {
            DockerRegistryConfigurationInput dockerRegistryConfigurationInput = new DockerRegistryConfigurationInput();
            dockerRegistryConfigurationInput.auth = this.auth;
            dockerRegistryConfigurationInput.name = this.name;
            dockerRegistryConfigurationInput.address = this.address;
            dockerRegistryConfigurationInput.registryType = this.registryType;
            dockerRegistryConfigurationInput.workspaceId = workspaceId;
            dockerRegistryConfigurationInput.authorId = authorId;
            return dockerRegistryConfigurationInput;
        }
    }
}
