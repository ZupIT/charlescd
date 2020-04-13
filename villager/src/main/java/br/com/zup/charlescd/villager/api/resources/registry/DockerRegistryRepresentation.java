/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;
import br.com.zup.charlescd.villager.interactor.registry.DockerRegistryDTO;

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
        return new DockerRegistryRepresentation(registryDTO.getId(), registryDTO.getName(), registryDTO.getProvider(), registryDTO.getAuthorId());
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
