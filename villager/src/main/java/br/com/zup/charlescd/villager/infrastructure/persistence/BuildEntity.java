/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity(name = "build")
public class BuildEntity extends PanacheEntityBase {

    @Id
    public String id;

    @Column(name = "tag_name")
    public String tagName;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    public BuildStatus status;

    @Column(name = "callback_url")
    public String callbackUrl;

    @Column(name = "callback_status")
    @Enumerated(EnumType.STRING)
    public CallbackStatus callbackStatus;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "finished_at")
    public LocalDateTime finishedAt;

    @Column(name = "circle_id")
    public String circleId;

    public static BuildEntity create(String tagName, String callbackUrl, String circleId) {
        BuildEntity buildEntity = new BuildEntity();
        buildEntity.id = UUID.randomUUID().toString();
        buildEntity.status = BuildStatus.CREATED;
        buildEntity.tagName = tagName;
        buildEntity.callbackUrl = callbackUrl;
        buildEntity.createdAt = LocalDateTime.now();
        buildEntity.circleId = circleId;
        return buildEntity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BuildEntity that = (BuildEntity) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
