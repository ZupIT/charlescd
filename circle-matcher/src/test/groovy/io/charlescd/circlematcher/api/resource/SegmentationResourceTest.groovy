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

package io.charlescd.circlematcher.api.resource

import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.domain.service.SegmentationService
import io.charlescd.circlematcher.utils.TestUtils
import spock.lang.Specification

class SegmentationResourceTest extends Specification {

    private SegmentationResource segmentationResource
    private SegmentationService segmentationService = Mock(SegmentationService)

    void setup() {
        segmentationResource = new SegmentationResource(segmentationService)
    }

    def "should create a new segmentation"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def request = TestUtils.createSegmentationRequest(node, SegmentationType.REGULAR)

        when:

        segmentationResource.create(request)

        then:

        1 * segmentationService.create(request)
    }

    def "should update a new segmentation"() {

        given:

        def value = "user@zup.com.br"
        def reference = "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def request = TestUtils.createUpdateSegmentationRequest(node, SegmentationType.REGULAR)

        when:

        segmentationResource.update(reference, request)

        then:

        1 * segmentationService.update(request)

    }

    def "should import and create segmentation"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def request = TestUtils.createSegmentationRequest(node, SegmentationType.REGULAR)
        def requests = new ArrayList()
        requests.add(request)

        when:

        segmentationResource.importCreate(requests)

        then:

        1 * segmentationService.create(request)
    }

    def "should import and update segmentation"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        def request = TestUtils.createUpdateSegmentationRequest(node, SegmentationType.REGULAR)
        def requests = new ArrayList()
        requests.add(request)

        when:

        segmentationResource.importUpdate(requests)

        then:

        1 * segmentationService.update(request)

    }

    def "should remove segmentation"() {

        given:

        def reference = "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"

        when:

        segmentationResource.remove(reference)

        then:

        1 * segmentationService.remove(reference)
    }
}
