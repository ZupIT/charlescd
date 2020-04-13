/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.registry;

import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;

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
        return RegistryConfigurationInputBuilder.aRegistryConfigurationInput();
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

        private static RegistryConfigurationInputBuilder aRegistryConfigurationInput() {
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

        public RegistryConfigurationInputBuilder withApplicationId(String workspaceId) {
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
