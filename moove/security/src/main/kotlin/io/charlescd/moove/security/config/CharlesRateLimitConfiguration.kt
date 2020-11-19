package io.charlescd.moove.security.config

import io.charlescd.moove.security.filter.RateLimitInterceptor
import io.charlescd.moove.security.service.RateLimitService
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@ComponentScan(basePackages = ["io.charlescd.moove.security"])
class CharlesRateLimitConfiguration(rateLimitService: RateLimitService) : WebMvcConfigurer {
    private val interceptor: RateLimitInterceptor = RateLimitInterceptor(rateLimitService)
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(interceptor)
            .addPathPatterns("/v2/**")
    }
}
