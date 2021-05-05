package io.charlescd.moove.security.filter

import io.charlescd.moove.security.SecurityConstraints
import io.charlescd.moove.security.config.Constants
import io.charlescd.moove.security.service.RateLimitService
import io.charlescd.moove.security.utils.FileUtils
import io.charlescd.moove.security.utils.FilterUtils
import io.github.bucket4j.Bucket
import io.github.bucket4j.ConsumptionProbe
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.web.servlet.HandlerInterceptor

class RateLimitInterceptor(private val rateLimitService: RateLimitService) : HandlerInterceptor {

    private var constraints: SecurityConstraints = FileUtils.read(Constants.SECURITY_CONSTRAINTS_FILE)

    companion object {
        const val AUTHORIZATION = "Authorization"
        const val SYSTEM_TOKEN = "X-Charles-Token"
        const val RATE_LIMIT_REMAINING = "X-Rate-Limit-Remaining"
        const val RATE_LIMIT_TRY_AGAIN = "X-Rate-Limit-Retry-After-milliseconds"
    }

    @Throws(Exception::class)
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {

        val path = request.requestURI
        val method = request.method

        if (FilterUtils.checkIfIsOpenPath(constraints, path, method)) {
            return true
        }

        var apiKey = ""

        when {
            !(request.getHeader(AUTHORIZATION).isNullOrBlank()) -> apiKey = request.getHeader(AUTHORIZATION)
            !(request.getHeader(SYSTEM_TOKEN).isNullOrBlank()) -> apiKey = request.getHeader(SYSTEM_TOKEN)
        }

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
}
