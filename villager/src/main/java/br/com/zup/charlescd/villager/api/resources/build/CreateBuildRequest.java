/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.build;

import br.com.zup.charlescd.villager.interactor.build.CreateBuildInput;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.Set;

public final class CreateBuildRequest {

    @Valid
    @NotEmpty
    private Set<ModuleRequestPart> modules;

    @NotEmpty
    private String tagName;

    @NotEmpty
    private String callbackUrl;

    @JsonCreator
    public CreateBuildRequest(@JsonProperty("modules") Set<ModuleRequestPart> modules,
                              @JsonProperty("tagName") String tagName,
                              @JsonProperty("callbackUrl") String callbackUrl) {
        this.modules = modules;
        this.tagName = tagName;
        this.callbackUrl = callbackUrl;
    }

    public CreateBuildInput toCreateBuildInput() {

        CreateBuildInput.Builder builder = CreateBuildInput.builder()
                .withTagName(this.getTagName())
                .withCallbackUrl(this.getCallbackUrl());

        this.getModules().forEach(
                modulePart -> builder.withModule(
                        modulePart.getId(),
                        modulePart.getName(),
                        modulePart.getRegistryConfigurationId(),
                        modulePart.getComponents()
                )
        );

        return builder.build();
    }

    public Set<ModuleRequestPart> getModules() {
        return modules;
    }

    public String getTagName() {
        return tagName;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

}
