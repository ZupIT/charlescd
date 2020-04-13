/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.misc;

import br.com.zup.charlescd.villager.exceptions.ResourceNotFoundException;
import br.com.zup.charlescd.villager.infrastructure.filter.RequestContext;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class ResourceNotFoundExceptionHandler implements ExceptionMapper<ResourceNotFoundException> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceNotFoundExceptionHandler.class);

    @Override
    public Response toResponse(ResourceNotFoundException exception) {

        LOGGER.error(RequestContext.getTag(), exception);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(objectMapper.writeValueAsString(new ErrorRepresentation(exception.getMessage())))
                    .header("Content-Type", MediaType.APPLICATION_JSON)
                    .build();
        } catch (JsonProcessingException e) {
            LOGGER.error(RequestContext.getTag(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
}
