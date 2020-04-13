/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.handlers.impl;

import br.com.zup.charlescd.villager.api.handlers.RequestHandler;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryTagsInput;

public class ListDockerRegistryTagsRequestHandler implements RequestHandler<ListDockerRegistryTagsInput> {

    private String applicationId;
    private String registryConfigurationId;
    private String componentName;
    private Integer max;
    private String last;

    public ListDockerRegistryTagsRequestHandler(String applicationId, String registryConfigurationId, String componentName, Integer max, String last) {
        this.applicationId = applicationId;
        this.registryConfigurationId = registryConfigurationId;
        this.componentName = componentName;
        this.max = max;
        this.last = last;
    }

    @Override
    public ListDockerRegistryTagsInput handle() {
        return ListDockerRegistryTagsInput.builder()
                .withApplicationId(applicationId)
                .withArtifactRepositoryConfigurationId(registryConfigurationId)
                .withArtifactName(componentName)
                .withMax(max)
                .withLast(last)
                .build();
    }
}
