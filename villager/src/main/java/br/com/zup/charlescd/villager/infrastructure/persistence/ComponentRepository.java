/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class ComponentRepository implements PanacheRepository<ComponentEntity> {

    public List<ComponentEntity> findByModule(String moduleEntityId) {
        List<ComponentEntity> result = find("moduleEntityId = ?1", moduleEntityId).list();
        return result != null ? result : Collections.emptyList();
    }

    public List<ComponentEntity> findByModuleId(String moduleId) {
        return find("module_id = ?1", moduleId).list();
    }

}
