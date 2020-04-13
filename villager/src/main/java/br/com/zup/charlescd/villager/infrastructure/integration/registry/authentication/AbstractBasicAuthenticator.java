/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.registry.authentication;

import javax.ws.rs.client.ClientRequestContext;
import java.util.Arrays;

public abstract class AbstractBasicAuthenticator implements BasicAuthenticator {

    @Override
    public void filter(ClientRequestContext clientRequestContext) {
        clientRequestContext.getHeaders().put("Authorization", Arrays.asList(loadBasicAuthorization()));
    }
}
