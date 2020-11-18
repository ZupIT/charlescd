package io.charlescd.moove.legacy.moove.request.card

import java.util.regex.Pattern
import org.springframework.util.Assert

class BranchNameValidations {
    fun validateBranchName(branchName: String) {
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
        Assert.doesNotContain(branchName, "//", "Branch name cannot have multiple consecutive slashes.")

        branchName.toByteArray(Charsets.UTF_8).forEach {
            Assert.isTrue(
                !Pattern.compile("^(?:[0-9]|[1-2][0-9]|[3][0-2]|58|94|12[6-7])\$").matcher(it.toString()).matches(),
                "Branch name cannot have ASCII control characters, space, tilde ~, caret ^, or colon : anywhere")
        }

        Assert.isTrue(!branchName.endsWith(".", true), "Branch name cannot end with a dot.")
        Assert.doesNotContain(branchName, "@{", "Branch name cannot contain a sequence '@{'.")
        Assert.isTrue(branchName != "@", "Branch name cannot be the single character '@'.")
        Assert.doesNotContain(branchName, "\\", "Branch name cannot contain a backslash.")
        Assert.isTrue(!branchName.startsWith("-", true), "Branch name cannot start with a dash '-'.")
    }
}
