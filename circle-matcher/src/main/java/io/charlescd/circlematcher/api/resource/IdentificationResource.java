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

package io.charlescd.circlematcher.api.resource;

import io.charlescd.circlematcher.api.request.IdentificationRequest;
import io.charlescd.circlematcher.api.response.IdentificationResponse;
import io.charlescd.circlematcher.domain.service.IdentificationService;
import javax.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IdentificationResource {

    private IdentificationService identificationService;

    public IdentificationResource(IdentificationService identificationService) {
        this.identificationService = identificationService;
    }

    @PostMapping(value = "/identify",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public IdentificationResponse identify(@RequestBody @Valid IdentificationRequest request) {
        return IdentificationResponse.of(this.identificationService.identify(request));
    }
}
