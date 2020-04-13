/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.moove;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@RegisterRestClient
public interface ConfigurationClient {

    @GET
    @Path("/credentials/{service}/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    Response getModuleConfigurations(@HeaderParam("X-organization") String org, @PathParam("service") String service, @PathParam("id") String id);

}
