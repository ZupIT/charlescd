package io.charlescd.moove.application.user.request

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.charlescd.moove.application.BasePatchRequest
import io.charlescd.moove.application.OpCodeEnum
import io.charlescd.moove.application.PatchOperation
import io.charlescd.moove.domain.User
import org.springframework.util.Assert

data class PatchUserRequest(override val patches: List<PatchOperation>) : BasePatchRequest<User>(patches) {

    companion object {
        val paths = listOf("/name")
    }

    override fun validate() {
        validatePaths()
        validateOperations()
        validateValues()
    }

    private fun validatePaths() {
        patches.forEach { patch ->
            Assert.isTrue(paths.contains(patch.path), "Path ${patch.path} is not allowed.")
        }
    }

    private fun validateOperations() {
        Assert.isTrue(patches.none { it.op == OpCodeEnum.REMOVE }, "Remove operation not allowed.")
    }

    private fun validateValues() {
        patches.forEach { patch ->
            when (patch.path) {
                "/name" -> validateNameValue(patch)
            }
        }
    }

    private fun validateNameValue(patch: PatchOperation) {
        Assert.notNull(patch.value, "Name cannot be null.")
        jacksonObjectMapper().convertValue<String>(patch.value!!).let { name ->
            Assert.isTrue((name.length in 1..64), "Name minimum size is 1 and maximum is 64.")
        }
    }
}
