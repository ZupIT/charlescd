/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.registry;

import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;

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
