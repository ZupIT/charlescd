/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

import org.keycloak.TokenVerifier
import org.springframework.util.AntPathMatcher

class DenyMatcher(var pattern: String = "", var roles: RoleMappings = linkedMapOf()) : Matcher {

    private val PERMITED_PATHS = listOf("/applications", "/circles", "/users")

    override fun authorizationsRules(
        path: String,
        method: String,
        authorization: String?,
        applicationId: String?
    ): Boolean {
        if (authorization.isNullOrEmpty()) return false
        val darwinAccessToken = parseAccessToken(authorization)
        val pathPattern = AntPathMatcher()
        if (pathPattern.match(pattern, path)) {
            val permitRules = roles.filter { it.value.contains(method) }.keys
            validateToken(path, darwinAccessToken, applicationId)
            return darwinAccessToken.realmAccess.roles.intersect(permitRules).isNotEmpty()
        }
        return false
    }

    private fun validateToken(
        path: String,
        darwinAccessToken: DarwinAccessToken,
        applicationId: String?
    ) {
        if (!PERMITED_PATHS.any { path.startsWith(it) }) {
            darwinAccessToken.applications
                ?.apply { validateApplicationId(applicationId, this) }
                ?: throw SecurityConstraintsException("Token without application IDs")
        }
    }

    private fun parseAccessToken(authorization: String): DarwinAccessToken {
        val token = authorization.substringAfter("Bearer").trim()
        val accessToken = TokenVerifier.create(token, DarwinAccessToken::class.java)
        return accessToken.token
    }

    override fun validate() {
        MatchersHelper.validatePattern(pattern)
        validateRoles(roles)
    }

    private fun validateRoles(roles: Any) {
        if (roles !is LinkedHashMap<*, *>) {
            throw SecurityConstraintsException("Invalid constraint roles")
        }

        roles.forEach { (name, methods) ->
            validateRoleName(name)
            MatchersHelper.validateMethods(methods)
        }
    }

    private fun validateRoleName(name: Any) {
        if (name !is String || name.isBlank()) {
            throw SecurityConstraintsException("Invalid constraint role name $name")
        }
    }

    private fun validateApplicationId(applicationId: String?, applications: List<String>) {
        applicationId
            ?.apply {
                if (!applications.contains(applicationId)) {
                    throw SecurityConstraintsException("Unauthorized application ID header")
                }
            }
            ?: throw SecurityConstraintsException("Missing application ID header")
    }
}