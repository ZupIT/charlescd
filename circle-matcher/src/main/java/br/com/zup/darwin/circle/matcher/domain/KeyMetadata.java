/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain;

public class KeyMetadata {

    private String reference;

    private String key;

    private SegmentationType type;

    private String name;

    private String circleId;

    public KeyMetadata() {
    }

    public KeyMetadata(String key, Segmentation segmentation) {
        this.reference = segmentation.getReference();
        this.key = key;
        this.type = segmentation.getType();
        this.circleId = segmentation.getCircleId();
        this.name = segmentation.getName();
    }

    public String getReference() {
        return reference;
    }

    public String getKey() {
        return key;
    }

    public SegmentationType getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getCircleId() {
        return circleId;
    }
}
