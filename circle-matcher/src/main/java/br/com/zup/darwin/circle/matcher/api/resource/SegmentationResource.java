/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.api.resource;

import br.com.zup.darwin.circle.matcher.api.request.CreateSegmentationRequest;
import br.com.zup.darwin.circle.matcher.api.request.UpdateSegmentationRequest;
import br.com.zup.darwin.circle.matcher.domain.service.SegmentationService;
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
