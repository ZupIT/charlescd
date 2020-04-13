/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotEmpty;

public class AWSCreateDockerRegistryRequest extends CreateDockerRegistryConfigurationRequest {
    private String accessKey;
    private String secretKey;
    private String region;

    @JsonCreator
    public AWSCreateDockerRegistryRequest(@JsonProperty("name") String name, @JsonProperty("address") String address,
                                          @JsonProperty("accessKey") String accessKey, @JsonProperty("secretKey") String secretKey,
                                          @JsonProperty("region") String region) {
        this.name = name;
        this.address = address;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.region = region;
    }

    @NotEmpty
    public String getAccessKey() {
        return accessKey;
    }

    @NotEmpty
    public String getSecretKey() {
        return secretKey;
    }

    @NotEmpty
    public String getRegion() {
        return region;
    }
}
