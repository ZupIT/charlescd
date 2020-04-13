/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.api.request;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateSegmentationRequest extends SegmentationRequest {

    @NotBlank
    private String previousReference;

    public String getPreviousReference() {
        return previousReference;
    }

    public void setPreviousReference(String previousReference) {
        this.previousReference = previousReference;
    }
}
