/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain;

public class Segmentation {

    private String name;

    private Node node;

    private String reference;

    private String circleId;

    private SegmentationType type;

    public Segmentation() {
    }

    public Segmentation(String name,
                        Node node,
                        String reference,
                        String circleId,
                        SegmentationType type) {
        this.name = name;
        this.node = node;
        this.reference = reference;
        this.circleId = circleId;
        this.type = type;
    }

    public static Segmentation of(KeyMetadata metadata) {
        return new Segmentation(
                metadata.getName(),
                null,
                metadata.getReference(),
                metadata.getCircleId(),
                metadata.getType()
        );
    }

    public String getName() {
        return name;
    }

    public Node getNode() {
        return node;
    }

    public String getReference() {
        return reference;
    }

    public String getCircleId() {
        return circleId;
    }

    public SegmentationType getType() {
        return type;
    }
}
