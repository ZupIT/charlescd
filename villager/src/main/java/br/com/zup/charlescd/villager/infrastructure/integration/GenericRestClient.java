/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration;

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
