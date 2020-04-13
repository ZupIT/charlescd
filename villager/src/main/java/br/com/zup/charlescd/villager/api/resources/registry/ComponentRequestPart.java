/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotBlank;

public class ComponentRequestPart {

    @NotBlank
    private String tagName;

    @NotBlank
    private String name;

    @JsonCreator
    public ComponentRequestPart(@JsonProperty("tagName") String tagName, @JsonProperty("name") String name) {
        this.tagName = tagName;
        this.name = name;
    }

    public String getTagName() {
        return tagName;
    }

    public String getName() {
        return name;
    }
}
