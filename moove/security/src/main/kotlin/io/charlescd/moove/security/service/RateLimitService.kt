package io.charlescd.moove.security.service

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.Bucket4j
import io.github.bucket4j.Refill
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class RateLimitService {

    @Value("\${charlescd.ratelimit.capacity:1}")
    private var capacity: Long = 0

    @Value("\${charlescd.ratelimit.tokens:1}")
    private var tokens: Long = 0

    @Value("\${charlescd.ratelimit.seconds:1}")
    private var seconds: Long = 0

    private val cache: MutableMap<String, Bucket> = ConcurrentHashMap()

    fun resolveBucket(apiKey: String): Bucket {
        return cache.computeIfAbsent(apiKey) { newBucket() }
    }

    protected fun newBucket(): Bucket = Bucket4j.builder()
        .addLimit(Bandwidth.classic(capacity, Refill.intervally(tokens, Duration.ofSeconds(seconds))))
        .build()
}
