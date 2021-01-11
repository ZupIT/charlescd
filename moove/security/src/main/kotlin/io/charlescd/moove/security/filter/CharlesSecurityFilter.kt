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

package io.charlescd.moove.security.filter

import feign.FeignException
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.security.SecurityConstraints
import io.charlescd.moove.security.config.Constants
import io.charlescd.moove.security.utils.FileUtils
import io.charlescd.moove.security.utils.FilterUtils
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.keycloak.TokenVerifier
import org.keycloak.representations.AccessToken
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean

@Component
@Profile("!local")
class CharlesSecurityFilter(val userRepository: UserRepository) : GenericFilterBean() {

    private var constraints: SecurityConstraints = FileUtils.read(Constants.SECURITY_CONSTRAINTS_FILE)

    companion object {
        const val X_WORKSPACE_ID = "X-Workspace-Id"
        const val AUTHORIZATION = "Authorization"
    }

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val httpRequest = request as HttpServletRequest

        val workspaceId = httpRequest.getHeader(X_WORKSPACE_ID)
        val authorization = httpRequest.getHeader(AUTHORIZATION)
        val path = httpRequest.requestURI
        val method = httpRequest.method

        try {
            doAuthorization(workspaceId, authorization, path, method)
            chain.doFilter(request, response)
        } catch (feignException: FeignException) {
            logger.error(feignException.message, feignException)
            createResponse(response, feignException.contentUTF8(), HttpStatus.UNAUTHORIZED)
        } catch (businessException: BusinessException) {
            logger.error(businessException.message, businessException)
            createResponse(response, businessException.message, HttpStatus.FORBIDDEN)
        } catch (exception: Exception) {
            logger.error(exception.message, exception)
            createResponse(response, exception.message, HttpStatus.UNAUTHORIZED)
        }
    }

    private fun createResponse(response: ServletResponse, message: String?, httpStatus: HttpStatus) {
        (response as HttpServletResponse).status = httpStatus.value()
        response.writer.print(message)
        response.writer.flush()
    }

    private fun doAuthorization(workspaceId: String?, authorization: String?, path: String, method: String) {
        if (FilterUtils.checkIfIsOpenPath(constraints, path, method)) {
            return
        }

        if (FilterUtils.checkIfIsManagementPath(constraints, path, method) && authorization != null) {
            return
        }

        val userEmail = getEmailFromAccessToken(authorization).orEmpty()

        val user = userRepository.findByEmail(userEmail).orElseThrow { Exception("User not found based on Authorization header") }

        if (user.root) {
            return
        }

        val workspace = user.workspaces.firstOrNull { it.id == workspaceId }

        workspace?.let {
            if (!FilterUtils.isValidConstraintPath(constraints, path, workspace, method)) {
                throw BusinessException.of(MooveErrorCode.FORBIDDEN)
            }
        } ?: throw BusinessException.of(MooveErrorCode.FORBIDDEN)
    }

    private fun getEmailFromAccessToken(authorization: String?): String? {
        return authorization?.let {
            val token = authorization.substringAfter("Bearer").trim()
            return TokenVerifier.create(token, AccessToken::class.java).token.email
        }
    }
}
