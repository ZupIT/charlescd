/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.connector

import br.com.zup.darwin.metrics.domain.Metric
import br.com.zup.darwin.metrics.domain.SearchMetric

interface MetricService {

    fun getTotalRequests(searchMetric: SearchMetric): Metric

    fun getAverageLatency(searchMetric: SearchMetric): Metric

    fun getAverageHttpErrors(searchMetric: SearchMetric): Metric

}