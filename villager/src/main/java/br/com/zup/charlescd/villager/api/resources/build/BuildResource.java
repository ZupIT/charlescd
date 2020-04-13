/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.build;

import br.com.zup.charlescd.villager.interactor.build.CreateBuildInteractor;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
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
    public NewBuildRepresentation createBuild(@Valid CreateBuildRequest request, @HeaderParam("X-Circle-Id") String circleId) {
        return NewBuildRepresentation.toRepresentation(this.createBuildInteractor.execute(request.toCreateBuildInput(), circleId));
    }
}
