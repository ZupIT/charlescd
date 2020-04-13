/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.build;

public class NewBuildDTO {

    private String id;

    public NewBuildDTO(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}
