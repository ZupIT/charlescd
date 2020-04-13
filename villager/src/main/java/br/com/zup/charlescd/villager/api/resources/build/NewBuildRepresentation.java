/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.build;

import br.com.zup.charlescd.villager.interactor.build.NewBuildDTO;

public class NewBuildRepresentation {

    public String id;

    public static NewBuildRepresentation toRepresentation(NewBuildDTO value) {
        NewBuildRepresentation representation = new NewBuildRepresentation();
        representation.id = value.getId();
        return representation;
    }

}
