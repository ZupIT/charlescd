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

public class GetDockerRegistryTagInput {
    private String artifactName;
    private String workspaceId;
    private String configurationId;
    private String name;

    private GetDockerRegistryTagInput(String artifactName, String workspaceId,
                                      String configurationId, String name) {
        this.artifactName = artifactName;
        this.workspaceId = workspaceId;
        this.configurationId = configurationId;
        this.name = name;
    }

    public String getArtifactName() {
        return artifactName;
    }


    public String getWorkspaceId() {
        return workspaceId;
    }

    public String getConfigurationId() {
        return configurationId;
    }

    public String getName() {
        return name;
    }

    public static ListDockerRegistryTagsInputBuilder builder() {
        return ListDockerRegistryTagsInputBuilder.newBuilder();
    }

    public static final class ListDockerRegistryTagsInputBuilder {
        private String artifactName;
        private String workspaceId;
        private String configurationId;
        private String name;


        private ListDockerRegistryTagsInputBuilder() {
        }

        private static ListDockerRegistryTagsInputBuilder newBuilder() {
            return new ListDockerRegistryTagsInputBuilder();
        }

        public ListDockerRegistryTagsInputBuilder withArtifactName(String artifactName) {
            this.artifactName = artifactName;
            return this;
        }

        public ListDockerRegistryTagsInputBuilder withWorkspaceId(String workspaceId) {
            this.workspaceId = workspaceId;
            return this;
        }

        public ListDockerRegistryTagsInputBuilder withConfigurationId(
                String artifactRepositoryConfigurationId) {
            this.configurationId = artifactRepositoryConfigurationId;
            return this;
        }

        public ListDockerRegistryTagsInputBuilder withName(String name) {
            this.name = name;
            return this;
        }

        public GetDockerRegistryTagInput build() {
            return new GetDockerRegistryTagInput(artifactName, workspaceId, configurationId, name);
        }
    }
}
