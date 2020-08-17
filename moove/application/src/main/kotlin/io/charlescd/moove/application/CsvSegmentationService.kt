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

package io.charlescd.moove.application

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.commons.extension.toJsonNode
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.io.InputStreamReader
import java.util.*
import javax.inject.Named
import org.apache.commons.io.IOUtils
import uk.gov.nationalarchives.csv.validator.api.java.CsvValidator
import uk.gov.nationalarchives.csv.validator.api.java.FailMessage

@Named
class CsvSegmentationService(private val objectMapper: ObjectMapper) {

    fun validate(input: InputStream, keyName: String) {
        var outputStream = createOutputStream(input)

        val errorMessages = validateCsvFormat(outputStream, createSchemaInputReader(keyName))

        if (errorMessages.isNotEmpty()) {
            throw BusinessException.of(MooveErrorCode.INVALID_PAYLOAD)
        }
    }

    fun createPreview(jsonNodes: List<JsonNode>): JsonNode {
        val part = jsonNodes.takeIf { it.size >= 5 }
            ?.let { nodes ->
                createNodePart(nodes.subList(0, 5))
            } ?: createNodePart(jsonNodes.subList(0, jsonNodes.size))

        return part.toJsonNode()
    }

    fun createJsonNodeList(content: InputStream, keyName: String): List<JsonNode> {
        content.reset()
        val rules = InputStreamReader(content).readLines()
        return rules.subList(
            createStartIndex(rules),
            createEndIndex(rules)
        ).map {
            createJsonNode(keyName, it)
        }
    }

    private fun createEndIndex(rules: List<String>) = if (rules.size > 1) rules.size else 0

    private fun createStartIndex(rules: List<String>) = if (rules.size > 1) 1 else 0

    private fun createJsonNode(keyName: String, value: String): JsonNode {
        return NodePart(
            type = NodePart.NodeTypeRequest.RULE,
            logicalOperator = NodePart.LogicalOperatorRequest.OR,
            content = NodePart.RulePart(keyName, NodePart.ConditionEnum.EQUAL, listOf(value))
        ).toJsonNode()
    }

    private fun createNodePart(nodes: List<JsonNode>) = NodePart(
        NodePart.NodeTypeRequest.CLAUSE,
        NodePart.LogicalOperatorRequest.OR,
        listOf(
            NodePart(
                NodePart.NodeTypeRequest.CLAUSE,
                NodePart.LogicalOperatorRequest.OR,
                nodes.map { objectMapper.treeToValue(it, NodePart::class.java) }
            )
        )
    )

    private fun validateCsvFormat(
        outputStream: ByteArrayOutputStream,
        schemaReader: InputStreamReader
    ): List<FailMessage> {
        return CsvValidator.validate(
            InputStreamReader(ByteArrayInputStream(outputStream.toByteArray())),
            schemaReader,
            true,
            ArrayList(),
            true,
            true
        )
    }

    private fun createSchemaInputReader(keyName: String): InputStreamReader {
        val schema = "version 1.0\n@totalColumns 1 $keyName: notEmpty"
        return InputStreamReader(schema.byteInputStream())
    }

    private fun createOutputStream(input: InputStream): ByteArrayOutputStream {
        var byteArrayOutputStream = ByteArrayOutputStream()
        IOUtils.copy(input, byteArrayOutputStream)
        return byteArrayOutputStream
    }
}
