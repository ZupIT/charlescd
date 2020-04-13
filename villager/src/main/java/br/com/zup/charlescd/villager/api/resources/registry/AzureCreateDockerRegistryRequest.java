/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class AzureCreateDockerRegistryRequest extends CreateDockerRegistryConfigurationRequest {
    private String username;
    private String password;

    @JsonCreator
    public AzureCreateDockerRegistryRequest(@JsonProperty("name") String name, @JsonProperty("address") String address,
                                            @JsonProperty("username") String username, @JsonProperty("password") String password) {
        this.name = name;
        this.address = address;
        this.username = username;
        this.password = password;
    }

    @NotEmpty
    public String getUsername() {
        return username;
    }

    @NotEmpty
    public String getPassword() {
        return password;
    }
}
