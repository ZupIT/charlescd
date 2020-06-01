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

package io.charlescd.villager.api.resources.build;

import io.charlescd.villager.interactor.build.CreateBuildInteractor;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/build")
public class BuildResource {

    private final CreateBuildInteractor createBuildInteractor;

    @Inject
    public BuildResource(CreateBuildInteractor createBuildInteractor) {
        this.createBuildInteractor = createBuildInteractor;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public NewBuildRepresentation createBuild(@Valid CreateBuildRequest request,
                                              @HeaderParam("X-Circle-Id") String circleId) {
        return NewBuildRepresentation
                .toRepresentation(this.createBuildInteractor.execute(request.toCreateBuildInput(), circleId));
    }
}
