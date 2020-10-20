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

package io.charlescd.villager.interactor.registry.impl;

import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.interactor.registry.TestDockerRegistryConnectionInput;
import io.charlescd.villager.interactor.registry.TestRegistryConnectivityInteractor;
import io.charlescd.villager.service.RegistryService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class TestRegistryConnectivityInteractorImpl implements TestRegistryConnectivityInteractor {

    private RegistryService registryService;

    @Inject
    public TestRegistryConnectivityInteractorImpl(
            RegistryService registryService
    ) {
        this.registryService = registryService;
    }

    @Override
    public void execute(TestDockerRegistryConnectionInput input) {
        DockerRegistryConfigurationEntity entity = registryService.getDockerRegistryConfigurationEntity(input.getWorkspaceId(), input.getRegistryConfigurationId());
        registryService.testRegistryConnectivityConfig(entity);
    }
}
