/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.service;

import br.com.zup.charlescd.villager.infrastructure.persistence.BuildEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.ModuleEntity;

import java.util.List;

public interface BuildNotificationService {

    void notify(BuildEntity buildEntity, List<ModuleEntity> modules);

}
