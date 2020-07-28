/*
 *
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *
 */

package io.charlescd.moove.metrics.api

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.metrics.api.response.ProviderConnectionRepresentation
import io.charlescd.moove.metrics.interactor.VerifyProviderConnectionInteractor
import io.swagger.annotations.Api
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Api(value = "Metrics Config", tags = ["Metric Config"])
@RestController
@RequestMapping("/metrics/config")
class ConfigController(
    private val verifyProviderConnectionInteractor: VerifyProviderConnectionInteractor
) {

    @GetMapping("/verify-provider-connection")
    fun verifyProvideConnection(
        @RequestParam provider: String,
        @RequestParam providerType: MetricConfiguration.ProviderEnum
    ): ProviderConnectionRepresentation =
        verifyProviderConnectionInteractor.execute(provider, providerType)

}
