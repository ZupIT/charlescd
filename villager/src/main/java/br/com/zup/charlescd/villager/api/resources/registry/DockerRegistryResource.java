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
