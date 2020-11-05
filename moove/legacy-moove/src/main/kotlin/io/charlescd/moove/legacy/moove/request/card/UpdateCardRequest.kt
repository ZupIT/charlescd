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

package io.charlescd.moove.legacy.moove.request.card

import org.springframework.util.Assert
import java.util.regex.Pattern
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class UpdateCardRequest(
    @field:NotBlank
    val name: String,

    val description: String?,

    @field:NotNull
    val labels: List<String>,

    @field:NotBlank
    val type: String,

    val branchName: String = "",

    val modules: List<String> = emptyList()

) {
    fun validate() {
        validateBranchName()
    }

    private fun validateBranchName() {
        if (branchName.contains("/", true)) {
            Assert.doesNotContain(branchName, "/.",
                "Branch name can include slash / for hierarchical (directory) grouping, but no slash-separated component can begin with a dot '.'.")
            Assert.doesNotContain(branchName, ".lock",
                "Branch name can include slash / for hierarchical (directory) grouping, but no slash-separated component can end with the sequence '.lock'.")
        }

        Assert.doesNotContain(branchName, "..", "Branch name cannot have two consecutive dots '..' anywhere.")

        Assert.doesNotContain(branchName, "?", "Branch name cannot have question-mark '?' anywhere.")
        Assert.doesNotContain(branchName, "*", "Branch name cannot have asterisk '*' anywhere.")
        Assert.doesNotContain(branchName, "[", "Branch name cannot have open bracket '[' anywhere.")

        Assert.isTrue(!branchName.startsWith("/", true), "Branch name cannot begin with a slash '/'.")
        Assert.isTrue(!branchName.endsWith("/", true), "Branch name cannot end with a slash '/'.")
        Assert.isTrue(!Pattern.compile("[/]{2}+").matcher(branchName).matches(), "Branch name cannot have multiple consecutive slashes.")

        branchName.toByteArray(Charsets.UTF_8).forEach {
            Assert.isTrue(
                !Pattern.compile("^(?:[0-9]|[1-2][0-9]|[3][0-2]|58|94|12[6-7])\$").matcher(it.toString()).matches(),
                "Branch name cannot have ASCII control characters (i.e. bytes whose values are lower than 32, or 127 DEL), space, tilde ~, caret ^, or colon : anywhere")
        }

        Assert.isTrue(!branchName.endsWith(".", true), "Branch name cannot end with a dot '.'.")
        Assert.doesNotContain(branchName, "@{", "Branch name cannot contain a sequence '@{'.")
        Assert.isTrue(branchName == "@", "Branch name cannot be the single character '@'.")
        Assert.doesNotContain(branchName, "\\", "Branch name cannot contain a '\\'.")
        Assert.isTrue(!branchName.startsWith("-", true), "Branch name cannot start with a dash '-'.")
    }
}
