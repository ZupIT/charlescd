package br.com.zup.darwin.moove.request.build

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class CreateBuildRequest(
    @field:NotBlank
    val authorId: String,

    @field:NotNull
    @field:NotEmpty
    val features: List<String>,

    @field:Size(min= 2, max = 54,message = "The number of characters must be between 2 and 54")
    val tagName: String,

    val hypothesisId: String?
)
