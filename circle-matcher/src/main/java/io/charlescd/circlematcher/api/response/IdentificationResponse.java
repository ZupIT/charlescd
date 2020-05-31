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

package io.charlescd.circlematcher.api.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.charlescd.circlematcher.domain.Circle;
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
