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
