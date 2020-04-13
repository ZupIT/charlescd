/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.moove;

import java.util.Map;

public class ModuleConfigs {

    private CredentialId credentialId;
    private Map<String,String> value;

    public Map<String, String> getValue() {
        return value;
    }

    public void setValue(Map<String, String> value) {
        this.value = value;
    }

    public CredentialId getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(CredentialId credentialId) {
        this.credentialId = credentialId;
    }
}
