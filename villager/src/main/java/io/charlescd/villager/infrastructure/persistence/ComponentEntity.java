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

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.*;

@Entity(name = "component")
public class ComponentEntity extends PanacheEntityBase {

    @Id
    public String id;

    @Column(name = "name")
    public String name;

    @Column(name = "tag_name")
    public String tagName;

    @Column(name = "module_id")
    public String moduleEntityId;

    public static ComponentEntity create(String name, String tagName, String moduleId) {

        ComponentEntity entity = new ComponentEntity();

        entity.id = UUID.randomUUID().toString();
        entity.name = name;
        entity.tagName = tagName;
        entity.moduleEntityId = moduleId;

        return entity;
    }

}
