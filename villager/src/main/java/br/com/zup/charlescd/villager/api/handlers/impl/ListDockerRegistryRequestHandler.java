/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.handlers.impl;

import br.com.zup.charlescd.villager.api.handlers.RequestHandler;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryInput;

public class ListDockerRegistryRequestHandler implements RequestHandler<ListDockerRegistryInput> {

    private String applicationId;

    public ListDockerRegistryRequestHandler(String applicationId) {
        this.applicationId = applicationId;
    }

    @Override
    public ListDockerRegistryInput handle() {
        return new ListDockerRegistryInput(this.applicationId);
    }
}
