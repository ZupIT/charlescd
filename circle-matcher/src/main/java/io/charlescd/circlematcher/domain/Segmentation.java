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

package io.charlescd.circlematcher.domain;



import java.time.LocalDateTime;

public class Segmentation {

    private String name;

    private Node node;

    private String reference;

    private String circleId;

    private SegmentationType type;

    private String workspaceId;

    private Boolean isDefault;

    private LocalDateTime createdAt;

    public Segmentation() {
    }

    public Segmentation(String name,
                        Node node,
                        String reference,
                        String circleId,
                        SegmentationType type,
                        String workspaceId,
                        Boolean isDefault,
                        LocalDateTime createdAt) {
        this.name = name;
        this.node = node;
        this.reference = reference;
        this.circleId = circleId;
        this.type = type;
        this.workspaceId = workspaceId;
        this.isDefault = isDefault;
        this.createdAt = createdAt;
    }

    public static Segmentation of(KeyMetadata metadata) {
        return new Segmentation(
                metadata.getName(),
                null,
                metadata.getReference(),
                metadata.getCircleId(),
                metadata.getType(),
                metadata.getWorkspaceId(),
                metadata.getIsDefault(),
                metadata.getCreatedAt());
    }

    public String getName() {
        return name;
    }

    public Node getNode() {
        return node;
    }

    public String getReference() {
        return reference;
    }

    public String getCircleId() {
        return circleId;
    }

    public SegmentationType getType() {
        return type;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }
}
