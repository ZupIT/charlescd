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

import io.charlescd.villager.infrastructure.persistence.BuildEntity;
import io.charlescd.villager.infrastructure.persistence.BuildRepository;
import io.charlescd.villager.infrastructure.persistence.ModuleEntity;
import io.charlescd.villager.infrastructure.persistence.ModuleRepository;
import io.charlescd.villager.interactor.build.RetryBuildStatusNotificationInteractor;
import io.charlescd.villager.service.BuildNotificationService;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class RetryBuildStatusNotificationInteractorImpl implements RetryBuildStatusNotificationInteractor {

    private static final Logger LOGGER = LoggerFactory.getLogger(RetryBuildStatusNotificationInteractorImpl.class);

    private BuildRepository buildRepository;
    private ModuleRepository moduleRepository;
    private BuildNotificationService notificationService;

    @Inject
    public RetryBuildStatusNotificationInteractorImpl(BuildRepository buildRepository,
                                                      ModuleRepository moduleRepository,
                                                      BuildNotificationService notificationService) {
        this.buildRepository = buildRepository;
        this.moduleRepository = moduleRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public void execute() {
        this.buildRepository.findBuildsToNotify().forEach(this::doNotification);
    }

    private void doNotification(BuildEntity buildEntity) {

        List<ModuleEntity> modules = moduleRepository.findByBuildId(buildEntity.id);
        try {
            this.notificationService.notify(buildEntity, modules);
        } catch (Exception e) {
            String tag = "[" + buildEntity.id + "]";
            LOGGER.error(tag + " - Error on sending callback", e);
        }
    }

}
