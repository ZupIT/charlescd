/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.List;

public class DockerRegistryListRepresentation {

    private List<DockerRegistryRepresentation> dockerRegistryList;

    public DockerRegistryListRepresentation(List<DockerRegistryRepresentation> dockerRegistryList) {
        this.dockerRegistryList = dockerRegistryList;
    }

    @JsonValue
    public List<DockerRegistryRepresentation> getDockerRegistryList() {
        return dockerRegistryList;
    }

}
