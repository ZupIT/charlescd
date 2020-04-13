/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.registry;

public class ListDockerRegistryTagsInput {
    private String artifactName;
    private String applicationId;
    private String artifactRepositoryConfigurationId;
    private Integer max;
    private String last;

    private ListDockerRegistryTagsInput(String artifactName, String applicationId, String artifactRepositoryConfigurationId, Integer max, String last) {
        this.artifactName = artifactName;
        this.applicationId = applicationId;
        this.artifactRepositoryConfigurationId = artifactRepositoryConfigurationId;
        this.max = max;
        this.last = last;
    }

    public String getArtifactName() {
        return artifactName;
    }


    public String getApplicationId() {
        return applicationId;
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
        private String applicationId;
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

        public ListDockerRegistryTagsInputBuilder withApplicationId(String applicationId) {
            this.applicationId = applicationId;
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
            return new ListDockerRegistryTagsInput(artifactName, applicationId, artifactRepositoryConfigurationId, max, last);
        }
    }
}
