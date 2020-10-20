package io.charlescd.moove.legacy.moove.api.config

import feign.codec.ErrorDecoder
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class VillagerFeignConfig {

    @Bean
    fun feignErrorDecoder(): ErrorDecoder? {
        return VillagerErrorDecoder()
    }

}
