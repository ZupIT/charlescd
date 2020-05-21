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

import io.charlescd.circlematcher.api.request.CreateSegmentationRequest;
import io.charlescd.circlematcher.api.request.UpdateSegmentationRequest;
import io.charlescd.circlematcher.domain.service.SegmentationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
public class SegmentationResource {

    private SegmentationService segmentationService;

    public SegmentationResource(SegmentationService segmentationService) {
        this.segmentationService = segmentationService;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(value = "/segmentation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void create(@RequestBody @Valid CreateSegmentationRequest createSegmentationRequest) {
        this.segmentationService.create(createSegmentationRequest);
    }

    @PutMapping(value = "/segmentation/{reference}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void update(@PathVariable("reference") String reference,
                       @RequestBody @Valid UpdateSegmentationRequest updateSegmentationRequest) {
        updateSegmentationRequest.setPreviousReference(reference);
        this.segmentationService.update(updateSegmentationRequest);
    }

    @PostMapping(value = "/segmentation/import", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void importCreate(@RequestBody @Valid List<CreateSegmentationRequest> request) {
        request.stream().parallel().forEach(item -> this.segmentationService.create(item));
    }

    @PutMapping(value = "/segmentation/import", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void importUpdate(@RequestBody @Valid List<UpdateSegmentationRequest> request) {
        request.stream().parallel().forEach(item -> this.segmentationService.update(item));
    }

    @DeleteMapping(value = "/segmentation/{reference}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void remove(@PathVariable("reference") String reference) {
        this.segmentationService.remove(reference);
    }
}
