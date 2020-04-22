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

package br.com.zup.charlescd.villager.interactor.registry;

public class ListDockerRegistryTagsInput {
    private String artifactName;
    private String workspaceId;
    private String artifactRepositoryConfigurationId;
    private Integer max;
    private String last;

    private ListDockerRegistryTagsInput(String artifactName, String workspaceId, String artifactRepositoryConfigurationId, Integer max, String last) {
        this.artifactName = artifactName;
        this.workspaceId = workspaceId;
        this.artifactRepositoryConfigurationId = artifactRepositoryConfigurationId;
        this.max = max;
        this.last = last;
    }

    public String getArtifactName() {
        return artifactName;
    }


    public String getWorkspaceId() {
        return workspaceId;
    }

    public String getArtifactRepositoryConfigurationId() {
        return artifactRepositoryConfigurationId;
    }

    public Integer getMax() {
        return max;
    }

    public String getLast() {
        return last;
    }

    public static ListDockerRegistryTagsInputBuilder builder() {
        return ListDockerRegistryTagsInputBuilder.aListDockerRegistryTagsInput();
    }

    public static final class ListDockerRegistryTagsInputBuilder {
        private String artifactName;
        private String workspaceId;
        private String artifactRepositoryConfigurationId;
        private Integer max;
        private String last;

        private ListDockerRegistryTagsInputBuilder() {
        }

        private static ListDockerRegistryTagsInputBuilder aListDockerRegistryTagsInput() {
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

        public ListDockerRegistryTagsInputBuilder withArtifactRepositoryConfigurationId(String artifactRepositoryConfigurationId) {
            this.artifactRepositoryConfigurationId = artifactRepositoryConfigurationId;
            return this;
        }

        public ListDockerRegistryTagsInputBuilder withMax(Integer max) {
            this.max = max;
            return this;
        }

        public ListDockerRegistryTagsInputBuilder withLast(String last) {
            this.last = last;
            return this;
        }

        public ListDockerRegistryTagsInput build() {
            return new ListDockerRegistryTagsInput(artifactName, workspaceId, artifactRepositoryConfigurationId, max, last);
        }
    }
}
