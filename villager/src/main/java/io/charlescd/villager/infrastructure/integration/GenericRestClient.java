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

package io.charlescd.villager.infrastructure.integration;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

@ApplicationScoped
public class GenericRestClient {

    public <T> Response doPost(String url, T payload, MultivaluedMap<String, Object> headers) {

        return ClientBuilder.newClient()
                .target(url)
                .request()
                .headers(headers)
                .post(Entity.entity(payload, MediaType.APPLICATION_JSON_TYPE));

    }

    public <T> T doGet(String url, MultivaluedMap<String, Object> headers, Class<T> type) {
        return ClientBuilder.newClient()
                .target(url)
                .request()
                .headers(headers)
                .get(type);
    }
}
