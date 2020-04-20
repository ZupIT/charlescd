/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.interactor

import br.com.zup.darwin.metrics.api.CircleMetricRepresentation
import br.com.zup.darwin.metrics.api.MetricType
import br.com.zup.darwin.metrics.api.ProjectionType

interface RetrieveCircleTechMetricInteractor {

    fun execute(circleId: String,
                projectionType: ProjectionType,
                metricType: MetricType): CircleMetricRepresentation
}