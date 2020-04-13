/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.registry;

import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Optional;

public interface RegistryClient {

    void configureAuthentication(RegistryType type, DockerRegistryConfigurationEntity.DockerRegistryConnectionData config);

    Optional<Response> getImage(String name, String tagName);

    TagsResponse listImageTags(String name, Integer max, String last) throws IOException;

}
