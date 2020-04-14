/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.api.configuration

import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import springfox.documentation.builders.PathSelectors
import springfox.documentation.builders.RequestHandlerSelectors
import springfox.documentation.service.ApiInfo
import springfox.documentation.service.Contact
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spring.web.plugins.Docket
import springfox.documentation.swagger2.annotations.EnableSwagger2

@Configuration
@EnableFeignClients
@EnableSwagger2
@ComponentScan(basePackages = ["br.com.zup.charles"])
class ApiConfiguration {

    @Bean
    fun api(): Docket = Docket(DocumentationType.SWAGGER_2)
        .select()
        .apis(RequestHandlerSelectors.any())
        .paths(PathSelectors.any())
        .build()
        .apiInfo(apiInfo())

    private fun apiInfo(): ApiInfo? {
        return ApiInfo(
            "CharlesCD Application",
            "CharlesCD Application Resources.",
            "1.0",
            "License Mozilla MPL",
            Contact(
                "CharlesCD",
                "https://sites.google.com/zup.com.br/zup/utilidades/dev-tools/Charles?authuser=0",
                null
            ),
            "License Mozilla MPL", "https://www.mozilla.org/en-US/MPL/", emptyList()
        )
    }
}

