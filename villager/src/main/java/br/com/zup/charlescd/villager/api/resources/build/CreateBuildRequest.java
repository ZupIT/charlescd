/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
