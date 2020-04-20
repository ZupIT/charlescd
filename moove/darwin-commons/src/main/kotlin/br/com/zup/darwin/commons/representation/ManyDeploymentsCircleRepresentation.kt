package br.com.zup.darwin.commons.representation

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime

data class ManyDeploymentsCircleRepresentation(
    val id: String,
    val name: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss") val createdAt: LocalDateTime,
    @JsonInclude(JsonInclude.Include.ALWAYS) val deployments: List<BasicDeploymentRepresentation?>
)