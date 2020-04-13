/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure

import br.com.zup.darwin.circle.matcher.domain.*
import br.com.zup.darwin.circle.matcher.utils.TestUtils
import spock.lang.Specification

class SegmentationKeyUtilsTest extends Specification {

    def "should extract the terms section from a composed key"() {

        given:

        def composedKey = "age_team_username:28840781-d86e-4803-a742-53566c140e56:SIMPLE_KV"

        when:

        def extractedKey = SegmentationKeyUtils.extract(composedKey)

        then:

        assert extractedKey != null
        assert extractedKey.length() > 0
        assert extractedKey == "age_team_username"

    }

    def "should generate a composed key in alphabetical order"() {

        given:

        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def clause = new ArrayList()

        def ageContent = new Content("age", "EQUAL", ["30"])
        def ageNode = new Node(NodeType.RULE, LogicalOperatorType.AND, null, ageContent)

        def usernameContent = TestUtils.createContent(values)
        def usernameNode = TestUtils.createNode(usernameContent)

        clause.add(ageNode)
        clause.add(usernameNode)

        def segmentationRule = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, clause, null)

        def segmentation = TestUtils.createSegmentation(segmentationRule, SegmentationType.REGULAR)

        when:

        def key = SegmentationKeyUtils.generate(segmentation)

        then:

        assert key != null
        assert key.length() > 0

        def terms = key.split(":")[0].split("_")

        assert terms[0] == "age" && terms[1] == "username"

    }
}