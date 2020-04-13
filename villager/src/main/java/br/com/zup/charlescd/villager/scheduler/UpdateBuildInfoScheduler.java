/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.scheduler;

import br.com.zup.charlescd.villager.interactor.build.UpdateBuildInfoInteractor;
import io.quarkus.scheduler.Scheduled;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class UpdateBuildInfoScheduler {

    private UpdateBuildInfoInteractor updateBuildInfoInteractor;

    @Inject
    public UpdateBuildInfoScheduler(UpdateBuildInfoInteractor updateBuildInfoInteractor) {
        this.updateBuildInfoInteractor = updateBuildInfoInteractor;
    }

    @Scheduled(every = "10s")
    public void execute() {
        this.updateBuildInfoInteractor.execute();
    }
}
