/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.registry;

public class ComponentTagDTO {

    private String name;
    private String artifact;

    public ComponentTagDTO(String name, String artifact) {
        this.name =  name;
        this.artifact = artifact;
    }

    public String getArtifact() {
        return artifact;
    }

    public String getName() {
        return name;
    }
}
