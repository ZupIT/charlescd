/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class BuildRepository implements PanacheRepository<BuildEntity> {

    public BuildEntity findById(String id) {
        return find("id", id).firstResult();
    }

    public List<BuildEntity> findBuildsToNotify() {
        return find("callback_status = ?1", CallbackStatus.FAILURE.name()).list();
    }

}
