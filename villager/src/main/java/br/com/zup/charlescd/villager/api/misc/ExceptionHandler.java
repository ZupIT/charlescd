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

package br.com.zup.charlescd.villager.api.misc;

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
public class ExceptionHandler implements ExceptionMapper<Exception> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandler.class);

    @Override
    public Response toResponse(Exception exception) {

        LOGGER.error(RequestContext.getTag(), exception);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return Response.status(checkStatus(exception))
                    .entity(objectMapper.writeValueAsString(new ErrorRepresentation(exception.getMessage())))
                    .header("Content-Type", MediaType.APPLICATION_JSON)
                    .build();
        } catch (JsonProcessingException e) {
            LOGGER.error(RequestContext.getTag(), e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    private Response.Status checkStatus(Exception ex) {
        if(ex instanceof IllegalArgumentException) {
            return Response.Status.BAD_REQUEST;
        }
        else {
            return Response.Status.INTERNAL_SERVER_ERROR;
        }
    }

}