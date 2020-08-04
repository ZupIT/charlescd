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

package io.charlescd.villager.api.handlers.impl;

import io.charlescd.villager.api.handlers.RequestHandler;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInput;

public class GetDockerRegistryTagHandler implements RequestHandler<GetDockerRegistryTagInput> {

    private String workspaceId;
    private String registryConfigurationId;
    private String componentName;
    private String name;

    public GetDockerRegistryTagHandler(String workspaceId, String registryConfigurationId,
                                       String componentName, String name) {
        this.workspaceId = workspaceId;
        this.registryConfigurationId = registryConfigurationId;
        this.componentName = componentName;
        this.name = name;
    }

    @Override
    public GetDockerRegistryTagInput handle() {
        return GetDockerRegistryTagInput.builder()
                .withWorkspaceId(workspaceId)
                .withArtifactRepositoryConfigurationId(registryConfigurationId)
                .withArtifactName(componentName)
                .withName(name)
                .build();
    }
}
