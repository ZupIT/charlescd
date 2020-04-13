/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.api.request;

import br.com.zup.darwin.circle.matcher.domain.Node;
import br.com.zup.darwin.circle.matcher.domain.Segmentation;
import br.com.zup.darwin.circle.matcher.domain.SegmentationType;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public abstract class SegmentationRequest {

    @NotBlank
    private String name;

    @Valid
    private Node node;

    @NotBlank
    private String reference;

    @NotBlank
    private String circleId;

    @NotNull
    private SegmentationType type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Node getNode() {
        return node;
    }

    public void setNode(Node node) {
        this.node = node;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getCircleId() {
        return circleId;
    }

    public void setCircleId(String circleId) {
        this.circleId = circleId;
    }

    public SegmentationType getType() {
        return type;
    }

    public void setType(SegmentationType type) {
        this.type = type;
    }

    public Segmentation toSegmentation() {
        return new Segmentation(this.name, this.node, this.reference, this.circleId, this.type);
    }

}
