/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import br.com.zup.charlescd.villager.interactor.registry.ComponentTagDTO;

public class ComponentTagRepresentation {

    private String name;
    private String artifact;

    private ComponentTagRepresentation(String name, String artifact) {
        this.name = name;
        this.artifact = artifact;
    }

    public static ComponentTagRepresentation toRepresentation(ComponentTagDTO componentTagDTO) {
        return new ComponentTagRepresentation(componentTagDTO.getName(), componentTagDTO.getArtifact());
    }

    public String getArtifact() {
        return artifact;
    }

    public String getName() {
        return name;
    }
}
