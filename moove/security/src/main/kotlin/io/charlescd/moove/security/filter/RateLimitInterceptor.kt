package io.charlescd.moove.security.filter

import io.charlescd.moove.security.service.RateLimitService
import io.github.bucket4j.Bucket
import io.github.bucket4j.ConsumptionProbe
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.keycloak.TokenVerifier
import org.keycloak.representations.AccessToken
import org.springframework.http.HttpStatus
import org.springframework.web.servlet.HandlerInterceptor

class RateLimitInterceptor(private val rateLimitService: RateLimitService) : HandlerInterceptor {

    companion object {
        const val AUTHORIZATION = "Authorization"
        const val RATE_LIMIT_REMAINING = "X-Rate-Limit-Remaining"
        const val RATE_LIMIT_TRY_AGAIN = "X-Rate-Limit-Retry-After-milliseconds"
    }

    @Throws(Exception::class)
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        val apiKey: String = request.getHeader(AUTHORIZATION)
        verifyAccessToken(apiKey)
        val tokenBucket: Bucket = rateLimitService.resolveBucket(apiKey)
        val probe: ConsumptionProbe = tokenBucket.tryConsumeAndReturnRemaining(1)
        return if (probe.isConsumed) {
            response.addHeader(RATE_LIMIT_REMAINING, java.lang.String.valueOf(probe.remainingTokens))
            true
        } else {
            val milliSecondsWaitForRefill: Long = probe.nanosToWaitForRefill / 1000000
            response.addHeader(RATE_LIMIT_TRY_AGAIN, milliSecondsWaitForRefill.toString())
            createResponse(response, "You have exhausted your API Request Quota", HttpStatus.TOO_MANY_REQUESTS)
            false
        }
    }

    private fun createResponse(response: ServletResponse, message: String?, httpStatus: HttpStatus) {
        (response as HttpServletResponse).status = httpStatus.value()
        response.writer.print(message)
        response.writer.flush()
    }

    private fun verifyAccessToken(authorization: String?) {
        authorization?.let {
            val token = authorization.substringAfter("Bearer").trim()
            TokenVerifier.create(token, AccessToken::class.java).token.isActive
        }
    }
}
