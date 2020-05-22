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

package io.charlescd.villager.infrastructure.persistence;

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
