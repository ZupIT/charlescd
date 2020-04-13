/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ModuleRepository implements PanacheRepository<ModuleEntity> {

    public List<ModuleEntity> findByJobId(String ciJobId) {
        return find("ciJobId", ciJobId).list();
    }

    public Optional<ModuleEntity> findByNameAndTagNameAndStatus(String name, String tagName, ModuleBuildStatus status) {
        return Optional.ofNullable(find("name = ?1 and tagName = ?2 and status = ?3", name, tagName, status).firstResult());
    }

    public List<ModuleEntity> findModulesByStatus(ModuleBuildStatus status) {
        return find("status = ?1", status).list();
    }

    public List<ModuleEntity> findByBuildId(String buildId) {
        return find("build_id = ?1", buildId).list();
    }

    public void persist(List<ModuleEntity> moduleEntityList) {
        persist(moduleEntityList.stream());
    }

}
