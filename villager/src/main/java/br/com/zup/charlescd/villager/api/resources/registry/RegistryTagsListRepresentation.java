/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import java.util.List;

public class RegistryTagsListRepresentation {

    private List<ComponentTagRepresentation> tags;

    public RegistryTagsListRepresentation(List<ComponentTagRepresentation> tags) {
        this.tags = tags;
    }

    public List<ComponentTagRepresentation> getTags() {
        return tags;
    }
}
