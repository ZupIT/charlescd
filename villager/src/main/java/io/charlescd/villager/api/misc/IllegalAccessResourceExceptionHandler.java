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

package io.charlescd.villager.api.misc;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.charlescd.villager.exceptions.IllegalAccessResourceException;
import io.charlescd.villager.infrastructure.filter.RequestContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
public class IllegalAccessResourceExceptionHandler implements ExceptionMapper<IllegalAccessResourceException> {

    private static final Logger LOGGER = LoggerFactory.getLogger(IllegalAccessResourceExceptionHandler.class);

    @Override
    public Response toResponse(IllegalAccessResourceException exception) {

        LOGGER.error(RequestContext.getTag(), exception);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return Response.status(Response.Status.FORBIDDEN)
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
