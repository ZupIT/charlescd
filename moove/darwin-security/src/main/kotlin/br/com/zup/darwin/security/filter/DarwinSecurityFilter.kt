/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.filter

import br.com.zup.darwin.security.constraint.DarwinSecurityConstraints
import br.com.zup.darwin.security.infrastructure.objectToJson
import br.com.zup.exception.handler.exception.BusinessException
import br.com.zup.exception.handler.to.ErrorCode
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
@Profile("!local")
class DarwinSecurityFilter @Autowired constructor(val constraints: DarwinSecurityConstraints) : GenericFilterBean() {

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        if (request !is HttpServletRequest || response !is HttpServletResponse) {
            throw IllegalArgumentException("Unhandled type.")
        }

        val applicationId = request.getHeader("X-Application-Id")
        val authorization = request.getHeader("Authorization")
        val path = request.requestURI
        val method = request.method

        if (constraints.validateToken(authorization, path, method, applicationId)) {
            chain.doFilter(request, response)
            return
        }

        fillAuthorizationFailed(
            BusinessException.of(
                ErrorCode("INVALID_AUTHORIZATION", "invalid.authorization")
            ), response
        )
    }

    private fun fillAuthorizationFailed(content: Any, response: HttpServletResponse) {
        response.status = HttpServletResponse.SC_UNAUTHORIZED
        response.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE)

        response.writer.print(content.objectToJson())
        response.writer.flush()
    }

}