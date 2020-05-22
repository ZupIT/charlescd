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

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "module")
public class ModuleEntity extends PanacheEntityBase {

    @Id
    public String id;

    @Column(name = "external_id")
    public String externalId;

    @Column(name = "name")
    public String name;

    @Column(name = "tag_name")
    public String tagName;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    public ModuleBuildStatus status;

    @Column(name = "ci_job_id")
    public String ciJobId;

    @Column(name = "build_id")
    public String buildEntityId;

    @Column(name = "registry_configuration_id")
    public String registryConfigurationId;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "finished_at")
    public LocalDateTime finishedAt;

    @Column(name = "registry")
    public String registry;

    public static ModuleEntity create(String externalId, String name, String tagName, String buildEntityId, String registryConfigurationId, String registry) {
        ModuleEntity moduleEntity = new ModuleEntity();
        moduleEntity.id = UUID.randomUUID().toString();
        moduleEntity.externalId = externalId;
        moduleEntity.name = name;
        moduleEntity.tagName = tagName;
        moduleEntity.status = ModuleBuildStatus.CREATED;
        moduleEntity.buildEntityId = buildEntityId;
        moduleEntity.createdAt = LocalDateTime.now();
        moduleEntity.registryConfigurationId = registryConfigurationId;
        moduleEntity.registry = registry;
        return moduleEntity;
    }

}
