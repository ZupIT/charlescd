package io.charlescd.moove.security.utils

import io.charlescd.moove.domain.WorkspacePermissions
import io.charlescd.moove.security.SecurityConstraints
import org.springframework.util.AntPathMatcher

object FilterUtils {

    fun checkIfIsOpenPath(
        constraints: SecurityConstraints,
        path: String,
        method: String
    ): Boolean {
        return constraints.publicConstraints.filter {
            AntPathMatcher().match(it.pattern, path)
        }.any {
            it.methods.any { mth ->
                mth.equals(method, ignoreCase = true)
            }
        }
    }

    fun checkIfIsManagementPath(
        constraints: SecurityConstraints,
        path: String,
        method: String
    ): Boolean {
        return constraints.managementConstraints.filter {
            AntPathMatcher().match(it.pattern, path)
        }.any {
            it.methods.any { mth ->
                mth.equals(method, ignoreCase = true)
            }
        }
    }

    fun isValidConstraintPath(
        constraints: SecurityConstraints,
        path: String,
        workspace: WorkspacePermissions,
        method: String
    ): Boolean {
        return constraints.constraints.filter {
            AntPathMatcher().match(it.pattern, path)
        }.any {
            it.roles.any { role ->
                checkIfContainsRole(workspace, role) && checkIfContainsMethod(role, method)
            }
        }
    }

    private fun checkIfContainsRole(
        workspace: WorkspacePermissions,
        permission: Map.Entry<String, List<String>>
    ): Boolean {
        return workspace.permissions.any { workspacePermission -> permission.key == workspacePermission.name }
    }

    private fun checkIfContainsMethod(
        role: Map.Entry<String, List<String>>,
        method: String
    ): Boolean {
        return role.value.any { mth -> mth.equals(method, ignoreCase = true) }
    }

}
