/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.test;

import br.com.zup.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import br.com.zup.charlescd.villager.interactor.registry.SaveDockerRegistryConfigurationInteractor;
import io.quarkus.test.Mock;

import javax.enterprise.context.ApplicationScoped;

@Mock
@ApplicationScoped
public class MockSaveDockerRegistryConfigurationInteractor implements SaveDockerRegistryConfigurationInteractor {

    @Override
    public String execute(DockerRegistryConfigurationInput input) {
        return "";
    }
}
