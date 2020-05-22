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
import io.charlescd.villager.infrastructure.integration.registry.RegistryClient;
import io.charlescd.villager.infrastructure.persistence.*;
import io.charlescd.villager.interactor.build.UpdateBuildInfoInteractor;
import io.charlescd.villager.service.BuildNotificationService;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class UpdateBuildInfoInteractorImpl implements UpdateBuildInfoInteractor {

    private BuildRepository buildRepository;
    private ModuleRepository moduleRepository;
    private ComponentRepository componentRepository;
    private BuildNotificationService buildNotificationService;
    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;
    private RegistryClient registryClient;
    private Integer timeout;

    @Inject
    public UpdateBuildInfoInteractorImpl(BuildRepository buildRepository,
                                         ModuleRepository moduleRepository,
                                         ComponentRepository componentRepository,
                                         BuildNotificationService buildNotificationService,
                                         DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository,
                                         RegistryClient registryClient,
                                         @ConfigProperty(name = "build.timeout") Integer timeout) {
        this.buildRepository = buildRepository;
        this.moduleRepository = moduleRepository;
        this.componentRepository = componentRepository;
        this.buildNotificationService = buildNotificationService;
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
        this.registryClient = registryClient;
        this.timeout = timeout;
    }

    @Override
    @Transactional
    public void execute() {

        moduleRepository.findModulesByStatus(ModuleBuildStatus.CREATED)
                .stream()
                .map(this::updateStatus)
                .map(m -> m.buildEntityId)
                .collect(Collectors.toSet())
                .forEach(this::notify);
    }

    private ModuleEntity updateStatus(ModuleEntity module) {

        if (module.createdAt.isBefore(LocalDateTime.now().minusMinutes(timeout))) {

            module.status = ModuleBuildStatus.TIME_OUT;
            module.finishedAt = LocalDateTime.now();

            moduleRepository.persist(module);

            BuildEntity buildEntity = buildRepository.findById(module.buildEntityId);
            buildEntity.finishedAt = LocalDateTime.now();
            buildEntity.status = BuildStatus.FAILURE;

            buildRepository.persist(buildEntity);

        } else {

            boolean isFinished = componentRepository.findByModuleId(module.id)
                    .stream()
                    .allMatch(component -> componentIsPresent(component, module.registryConfigurationId));

            if (isFinished) {
                module.finishedAt = LocalDateTime.now();
                module.status = ModuleBuildStatus.SUCCESS;

                moduleRepository.persist(module);
            }

        }

        return module;
    }

    private void notify(String buildEntityId) {

        List<ModuleEntity> modules = moduleRepository.findByBuildId(buildEntityId);

        boolean isFinished = modules.stream().noneMatch(m -> m.status.equals(ModuleBuildStatus.CREATED));

        if (!isFinished) {
            return;
        }

        boolean hasAnyTimeout = modules.stream().anyMatch(m -> m.status.equals(ModuleBuildStatus.TIME_OUT));

        BuildEntity buildEntity = buildRepository.findById(buildEntityId);

        if (hasAnyTimeout) {
            this.buildNotificationService.notify(buildEntity, Collections.EMPTY_LIST);
            return;
        }

        buildEntity.finishedAt = LocalDateTime.now();
        buildEntity.status = BuildStatus.SUCCESS;
        buildRepository.persist(buildEntity);

        this.buildNotificationService.notify(buildEntity, modules);

    }

    private boolean componentIsPresent(ComponentEntity component, String registryConfigurationId) {
        var optionalEntity = this.dockerRegistryConfigurationRepository.findById(registryConfigurationId);
        var entity = optionalEntity.orElseThrow(() -> new ResourceNotFoundException(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY));

        this.registryClient.configureAuthentication(entity.type, entity.connectionData);

        // TODO: Verificar necessidade de serializacao
        return registryClient.getImage(component.name, component.tagName).isPresent() &&
                registryClient.getImage(component.name, component.tagName).get().getStatus() == 200;
    }

}
