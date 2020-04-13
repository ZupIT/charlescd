/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import javax.ws.rs.core.UriBuilder;
import java.net.URI;
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
