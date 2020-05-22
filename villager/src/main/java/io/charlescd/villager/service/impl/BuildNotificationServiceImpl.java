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

package io.charlescd.villager.service.impl;

import io.charlescd.villager.infrastructure.integration.GenericRestClient;
import io.charlescd.villager.infrastructure.integration.callback.CallbackPayload;
import io.charlescd.villager.infrastructure.persistence.*;
import io.charlescd.villager.service.BuildNotificationService;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class BuildNotificationServiceImpl implements BuildNotificationService {

    private GenericRestClient restClient;
    private ComponentRepository componentRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(BuildNotificationServiceImpl.class);

    @Inject
    public BuildNotificationServiceImpl(GenericRestClient restClient, ComponentRepository componentRepository) {
        this.restClient = restClient;
        this.componentRepository = componentRepository;
    }

    @Transactional
    public void notify(BuildEntity buildEntity, List<ModuleEntity> modules) {

        CallbackPayload payload = new CallbackPayload(buildEntity.status.name());

        modules.forEach(moduleEntity -> {

            List<ComponentEntity> componentList = componentRepository.findByModule(moduleEntity.id);

            payload.addModule(CallbackPayload.ModulePart.newBuilder()
                    .withModuleId(moduleEntity.externalId)
                    .withStatus(moduleEntity.status.name())
                    .withComponents(componentList.stream()
                            .map(componentEntity -> new CallbackPayload.ComponentPart.Builder()
                                    .withName(
                                            String.format(
                                                    "%s/%s:%s",
                                                    moduleEntity.registry,
                                                    componentEntity.name,
                                                    componentEntity.tagName
                                            )
                                    )
                                    .withTagName(componentEntity.tagName)
                                    .build())
                            .collect(Collectors.toSet()))
                    .build());
        });

        MultivaluedMap<String, Object> headers = new MultivaluedHashMap<>();

        if (buildEntity.circleId != null) {
            headers.add("X-Circle-Id", buildEntity.circleId);
        }

        Response response;

        try {

            response = this.restClient.doPost(buildEntity.callbackUrl, payload, headers);

        } catch (Exception e) {

            LOGGER.error("Could not send callback request.", e);
            buildEntity.callbackStatus = CallbackStatus.FAILURE;
            buildEntity.persist();

            return;

        }

        if (response.getStatus() != HttpStatus.SC_NO_CONTENT) {

            LOGGER.error(createErrorMessage(buildEntity.callbackUrl, response));
            buildEntity.callbackStatus = CallbackStatus.FAILURE;
            buildEntity.persist();

            return;

        }

        buildEntity.callbackStatus = CallbackStatus.SUCCESS;
        buildEntity.persist();
    }

    private String createErrorMessage(String uri, Response response) {
        return new StringBuilder("Could not send callback request - ")
                .append(uri)
                .append(" - ")
                .append("HttpStatus: ")
                .append(response.getStatus())
                .append(" - ")
                .append(response.readEntity(String.class))
                .toString();
    }

}
