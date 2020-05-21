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

package io.charlescd.circlematcher.infrastructure


import io.charlescd.circlematcher.domain.Content
import io.charlescd.circlematcher.domain.LogicalOperatorType
import io.charlescd.circlematcher.domain.Node
import io.charlescd.circlematcher.domain.NodeType
import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.utils.TestUtils
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
