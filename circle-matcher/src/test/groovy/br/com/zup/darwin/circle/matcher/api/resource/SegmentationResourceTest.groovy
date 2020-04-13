/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.api.resource

import br.com.zup.darwin.circle.matcher.domain.SegmentationType
import br.com.zup.darwin.circle.matcher.domain.service.SegmentationService
import br.com.zup.darwin.circle.matcher.utils.TestUtils
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
