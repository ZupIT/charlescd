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

package io.charlescd.villager.interactor.build.impl;

import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.persistence.BuildEntity;
import io.charlescd.villager.infrastructure.persistence.BuildRepository;
import io.charlescd.villager.infrastructure.persistence.BuildStatus;
import io.charlescd.villager.infrastructure.persistence.ComponentEntity;
import io.charlescd.villager.infrastructure.persistence.ComponentRepository;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.infrastructure.persistence.ModuleEntity;
import io.charlescd.villager.infrastructure.persistence.ModuleRepository;
import io.charlescd.villager.interactor.build.CreateBuildInput;
import io.charlescd.villager.interactor.build.CreateBuildInteractor;
import io.charlescd.villager.interactor.build.NewBuildDTO;
import io.charlescd.villager.util.ModuleNameUtils;
import java.time.LocalDateTime;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;

@ApplicationScoped
public class CreateBuildInteractorImpl implements CreateBuildInteractor {

    private BuildRepository buildRepository;
    private ComponentRepository componentRepository;
    private ModuleRepository moduleRepository;
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Inject
    public CreateBuildInteractorImpl(BuildRepository buildRepository, ComponentRepository componentRepository,
                                     ModuleRepository moduleRepository,
                                     DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository) {
        this.buildRepository = buildRepository;
        this.componentRepository = componentRepository;
        this.moduleRepository = moduleRepository;
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
    }

    @Override
    @Transactional(dontRollbackOn = RuntimeException.class)
    public NewBuildDTO execute(@Valid CreateBuildInput input, String circleId) {

        BuildEntity buildEntity = BuildEntity.create(input.getTagName(), input.getCallbackUrl(), circleId);

        buildRepository.persist(buildEntity);

        try {

            input.getModules().forEach(module -> persistModule(module, buildEntity));

            return new NewBuildDTO(buildEntity.id);

        } catch (Exception ex) {
            buildEntity.status = BuildStatus.CREATION_FAILURE;
            buildEntity.finishedAt = LocalDateTime.now();
            buildRepository.persist(buildEntity);
            throw new RuntimeException("Build request creation failure", ex);
        }
    }

    private void persistModule(@Valid CreateBuildInput.Module module, BuildEntity buildEntity) {

        var optionalEntity = dockerRegistryConfigurationRepository.findById(module.getRegistryConfigurationId());
        var entity = optionalEntity
                .orElseThrow(
                        () -> new ResourceNotFoundException(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY));

        ModuleEntity moduleEntity = ModuleEntity.create(
                module.getId(),
                ModuleNameUtils.normalize(module.getName()),
                buildEntity.tagName,
                buildEntity.id,
                module.getRegistryConfigurationId(),
                entity.connectionData.host
        );

        moduleRepository.persist(moduleEntity);

        componentRepository.persist(module.getComponents().stream()
                .map(component -> ComponentEntity.create(component.getName(), component.getTagName(), moduleEntity.id)
                ));

    }

}
