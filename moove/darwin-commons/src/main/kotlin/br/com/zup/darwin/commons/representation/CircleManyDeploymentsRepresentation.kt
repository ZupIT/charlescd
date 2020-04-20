package br.com.zup.darwin.commons.representation

import br.com.zup.darwin.entity.MatcherType
import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.databind.JsonNode
import java.time.LocalDateTime

data class CircleManyDeploymentsRepresentation(
    val id: String,
    val name: String,
    val author: SimpleUserRepresentation?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val matcherType: MatcherType,
    val rules: JsonNode?,
    @JsonInclude(Include.ALWAYS)
    val deployments: List<DeploymentRepresentation?>,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val importedAt: LocalDateTime?,
    val importedKvRecords: Int?
)
