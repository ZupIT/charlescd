/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.resources.registry;

import br.com.zup.charlescd.villager.api.handlers.impl.CreateDockerRegistryRequestHandler;
import br.com.zup.charlescd.villager.api.handlers.impl.ListDockerRegistryRequestHandler;
import br.com.zup.charlescd.villager.api.handlers.impl.ListDockerRegistryTagsRequestHandler;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryInteractor;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryTagsInteractor;
import br.com.zup.charlescd.villager.interactor.registry.SaveDockerRegistryConfigurationInteractor;
import br.com.zup.charlescd.villager.util.Constants;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.stream.Collectors;

@Path("/registry")
public class DockerRegistryResource {

    private ListDockerRegistryInteractor listDockerRegistryInteractor;
    private ListDockerRegistryTagsInteractor listDockerRegistryTagsInteractor;
    private SaveDockerRegistryConfigurationInteractor saveDockerRegistryConfigurationInteractor;

    @Inject
    public DockerRegistryResource(ListDockerRegistryInteractor listDockerRegistryInteractor, ListDockerRegistryTagsInteractor listDockerRegistryTagsInteractor, SaveDockerRegistryConfigurationInteractor saveDockerRegistryConfigurationInteractor) {
        this.listDockerRegistryInteractor = listDockerRegistryInteractor;
        this.listDockerRegistryTagsInteractor = listDockerRegistryTagsInteractor;
        this.saveDockerRegistryConfigurationInteractor = saveDockerRegistryConfigurationInteractor;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@HeaderParam(Constants.X_APPLICATION_ID) String applicationId, @Valid CreateDockerRegistryConfigurationRequest request) {

        var requestHandler = new CreateDockerRegistryRequestHandler(applicationId, request);

        return Response
                .status(Response.Status.CREATED)
                .entity(new NewRegistryConfigurationRepresentation(this.saveDockerRegistryConfigurationInteractor.execute(requestHandler.handle())))
                .build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public DockerRegistryListRepresentation list(@HeaderParam(Constants.X_APPLICATION_ID) String applicationId) {
        var requestHandler = new ListDockerRegistryRequestHandler(applicationId);

        return new DockerRegistryListRepresentation(
                this.listDockerRegistryInteractor.execute(requestHandler.handle())
                        .stream()
                        .map(registryDTO -> DockerRegistryRepresentation.toRepresentation(registryDTO))
                        .collect(Collectors.toList()));
    }

    @GET
    @Path("/{registryConfigurationId}/components/{componentName}/tags")
    @Produces(MediaType.APPLICATION_JSON)
    public RegistryTagsListRepresentation tagsList(@HeaderParam(Constants.X_APPLICATION_ID) String applicationId,
                                                   @PathParam("registryConfigurationId") String registryConfigurationId,
                                                   @PathParam("componentName") String componentName,
                                                   @QueryParam("max") Integer max,
                                                   @QueryParam("last") String last) {

        var requestHandler = new ListDockerRegistryTagsRequestHandler(applicationId, registryConfigurationId, componentName, max, last);

        return new RegistryTagsListRepresentation(
                this.listDockerRegistryTagsInteractor.execute(requestHandler.handle())
                        .stream()
                        .map(tag -> ComponentTagRepresentation.toRepresentation(tag))
                        .collect(Collectors.toList()));
    }

}
