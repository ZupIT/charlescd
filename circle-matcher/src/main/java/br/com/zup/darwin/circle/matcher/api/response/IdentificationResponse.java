/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.api.response;

import br.com.zup.darwin.circle.matcher.domain.Circle;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Set;
import java.util.stream.Collectors;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class IdentificationResponse {

    private Set<CircleResponse> circles;

    public IdentificationResponse(Set<CircleResponse> circles) {
        this.circles = circles;
    }

    public static IdentificationResponse of(Set<Circle> circles) {
        return new IdentificationResponse(from(circles));
    }

    public Set<CircleResponse> getCircles() {
        return circles;
    }

    private static Set<CircleResponse> from(Set<Circle> circles) {
        return circles.stream().map(
                item -> new CircleResponse(item.getId(), item.getName())
        ).collect(Collectors.toSet());
    }

}
