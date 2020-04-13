/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.hibernate.validator.constraints.URL;

import javax.validation.constraints.NotEmpty;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "provider"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = AzureCreateDockerRegistryRequest.class, name = "Azure"),
        @JsonSubTypes.Type(value = AWSCreateDockerRegistryRequest.class, name = "AWS")
})
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class CreateDockerRegistryConfigurationRequest {

    @NotEmpty
    protected String name;
    @URL
    @NotEmpty
    protected String address;

    @NotEmpty
    protected String authorId;

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getAuthorId() {
        return authorId;
    }

}
