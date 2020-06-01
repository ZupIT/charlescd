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

package io.charlescd.villager.interactor.registry;

import io.charlescd.villager.infrastructure.integration.registry.RegistryType;

public class DockerRegistryDTO {
    private String id;
    private String name;
    private RegistryType provider;
    private String authorId;

    public DockerRegistryDTO(String id, String name, RegistryType provider, String authorId) {
        this.id = id;
        this.name = name;
        this.provider = provider;
        this.authorId = authorId;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public RegistryType getProvider() {
        return provider;
    }

    public String getAuthorId() {
        return authorId;
    }
}
