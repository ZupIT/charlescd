/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.connector

import org.springframework.context.ApplicationContext
import org.springframework.stereotype.Service

@Service
class MetricServiceFactoryImpl(val context: ApplicationContext) : MetricServiceFactory {

    override fun getConnector(provider: MetricProvider): MetricService {
        return context.getBean(provider.connectorName) as MetricService
    }
}