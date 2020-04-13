/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.build.impl;

import br.com.zup.charlescd.villager.infrastructure.persistence.BuildEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.BuildRepository;
import br.com.zup.charlescd.villager.infrastructure.persistence.ModuleEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.ModuleRepository;
import br.com.zup.charlescd.villager.interactor.build.RetryBuildStatusNotificationInteractor;
import br.com.zup.charlescd.villager.service.BuildNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class RetryBuildStatusNotificationInteractorImpl implements RetryBuildStatusNotificationInteractor {

    private static final Logger LOGGER = LoggerFactory.getLogger(RetryBuildStatusNotificationInteractorImpl.class);

    private BuildRepository buildRepository;
    private ModuleRepository moduleRepository;
    private BuildNotificationService notificationService;

    @Inject
    public RetryBuildStatusNotificationInteractorImpl(BuildRepository buildRepository, ModuleRepository moduleRepository, BuildNotificationService notificationService) {
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
