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
