/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.api.resource;

import br.com.zup.darwin.circle.matcher.api.response.IdentificationResponse;
import br.com.zup.darwin.circle.matcher.domain.service.IdentificationService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class IdentificationResource {

    private IdentificationService identificationService;

    public IdentificationResource(IdentificationService identificationService) {
        this.identificationService = identificationService;
    }

    @PostMapping(value = "/identify",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public IdentificationResponse identify(@RequestBody Map<String, Object> request) {
        return IdentificationResponse.of(this.identificationService.identify(request));
    }
}
