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

package io.charlescd.villager.api.resources.registry;

import io.charlescd.villager.api.handlers.impl.CreateDockerRegistryRequestHandler;
import io.charlescd.villager.api.handlers.impl.GetDockerRegistryTagHandler;
import io.charlescd.villager.api.handlers.impl.ListDockerRegistryRequestHandler;
import io.charlescd.villager.api.handlers.impl.TestDockerRegistryConnectionHandler;
import io.charlescd.villager.interactor.registry.*;
import io.charlescd.villager.util.Constants;
import org.jboss.resteasy.annotations.Status;

import java.io.IOException;
import java.util.ArrayList;
import java.util.stream.Collectors;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/registry")
public class DockerRegistryResource {

    private ListDockerRegistryInteractor listDockerRegistryInteractor;
    private GetDockerRegistryTagInteractor getDockerRegistryTagInteractor;
    private SaveDockerRegistryConfigurationInteractor saveDockerRegistryConfigurationInteractor;
    private DeleteDockerRegistryConfigurationInteractor deleteDockerRegistryConfigurationInteractor;
    private TestRegistryConnectivityInteractor testRegistryConnectivityInteractor;
    private TestRegistryConfigInteractor testRegistryConfigInteractor;

    @Inject
    public DockerRegistryResource(ListDockerRegistryInteractor listDockerRegistryInteractor,
                                  GetDockerRegistryTagInteractor getDockerRegistryTagInteractor,
                                  SaveDockerRegistryConfigurationInteractor saveDockerRegistryConfigurationInteractor,
                                  DeleteDockerRegistryConfigurationInteractor deleteDockerRegistryConfigInteractor,
                                  TestRegistryConnectivityInteractor testRegistryConnectivityInteractor,
                                  TestRegistryConfigInteractor testRegistryConfigInteractor) {
        this.listDockerRegistryInteractor = listDockerRegistryInteractor;
        this.getDockerRegistryTagInteractor = getDockerRegistryTagInteractor;
        this.saveDockerRegistryConfigurationInteractor = saveDockerRegistryConfigurationInteractor;
        this.deleteDockerRegistryConfigurationInteractor = deleteDockerRegistryConfigInteractor;
        this.testRegistryConnectivityInteractor = testRegistryConnectivityInteractor;
        this.testRegistryConfigInteractor = testRegistryConfigInteractor;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@HeaderParam(Constants.X_WORKSPACE_ID) String workspaceId,
                           @Valid CreateDockerRegistryConfigurationRequest request) {

        var requestHandler = new CreateDockerRegistryRequestHandler(workspaceId, request);

        return Response
                .status(Response.Status.CREATED)
                .entity(new NewRegistryConfigurationRepresentation(
                        this.saveDockerRegistryConfigurationInteractor.execute(requestHandler.handle())))
                .build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public DockerRegistryListRepresentation list(@HeaderParam(Constants.X_WORKSPACE_ID) String workspaceId) {
        var requestHandler = new ListDockerRegistryRequestHandler(workspaceId);

        return new DockerRegistryListRepresentation(
                this.listDockerRegistryInteractor.execute(requestHandler.handle())
                        .stream()
                        .map(DockerRegistryRepresentation::toRepresentation)
                        .collect(Collectors.toList()));
    }

    @GET
    @Path("/{registryConfigurationId}/components/{componentName}/tags")
    @Produces(MediaType.APPLICATION_JSON)
    public RegistryTagsListRepresentation getComponentTag(@HeaderParam(Constants.X_WORKSPACE_ID) String workspaceId,
                                                          @PathParam("registryConfigurationId") String registryConfigId,
                                                          @PathParam("componentName") String componentName,
                                                          @QueryParam("name") String name) throws IOException {

        var requestHandler =
                new GetDockerRegistryTagHandler(workspaceId, registryConfigId, componentName, name);

        var response = this.getDockerRegistryTagInteractor.execute(requestHandler.handle());
        var componentTagList = new ArrayList<ComponentTagRepresentation>();

        response.ifPresent(componentTagDTO ->
                componentTagList.add(ComponentTagRepresentation.toRepresentation(componentTagDTO))
        );

        return new RegistryTagsListRepresentation(componentTagList);
    }

    @POST
    @Path("/config-validation")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response testConnection(@HeaderParam(Constants.X_WORKSPACE_ID) String workspaceId,
                               @Valid CreateDockerRegistryConfigurationRequest request) {

        var requestHandler = new CreateDockerRegistryRequestHandler(workspaceId, request);
        this.testRegistryConfigInteractor.execute(requestHandler.handle());
        return Response.status(200).build();
    }

    @POST
    @Path("/connection-validation")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response validateConfig(@HeaderParam(Constants.X_WORKSPACE_ID) String workspaceId,
                               @Valid TestDockerRegistryConnectionRequest request) {
        var requestHandler =
                new TestDockerRegistryConnectionHandler(workspaceId, request.artifactRepositoryConfigurationId);
        this.testRegistryConnectivityInteractor.execute(requestHandler.handle());
        return Response.status(200).build();
    }

    @DELETE
    @Path("/{id}")
    public void delete(@HeaderParam(Constants.X_WORKSPACE_ID) String workspaceId,
                       @PathParam("id") String registryConfigurationId) {
        deleteDockerRegistryConfigurationInteractor.execute(registryConfigurationId, workspaceId);
    }
}
