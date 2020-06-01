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

package io.charlescd.villager.api.resources.registry;

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.interactor.registry.DockerRegistryDTO;

public class DockerRegistryRepresentation {

    private String id;
    private String name;
    private RegistryType type;
    private String authorId;

    public DockerRegistryRepresentation(String id, String name, RegistryType type, String authorId) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.authorId = authorId;
    }

    public static DockerRegistryRepresentation toRepresentation(DockerRegistryDTO registryDTO) {
        return new DockerRegistryRepresentation(registryDTO.getId(), registryDTO.getName(), registryDTO.getProvider(),
                registryDTO.getAuthorId());
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public RegistryType getType() {
        return type;
    }

    public String getAuthorId() {
        return authorId;
    }
}
