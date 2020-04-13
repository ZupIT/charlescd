/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.registry.authentication;

import java.util.Base64;

public class CommonBasicAuthenticator extends AbstractBasicAuthenticator {

    private final String username;
    private final String password;

    public CommonBasicAuthenticator(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String loadBasicAuthorization() {
        byte[] bytes = String.format("%s:%s", this.username, this.password).getBytes();
        String token = Base64.getEncoder().encodeToString(bytes);

        return String.format("Basic %s", token);
    }

}
