/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.metrics.api.response

import io.charlescd.moove.metrics.domain.HealthStatus


data class CircleHealthRepresentation(val requests: CircleRequestsRepresentation,
                                      val latency: CircleHealthTypeRepresentation,
                                      val errors: CircleHealthTypeRepresentation)

data class CircleRequestsRepresentation(val value: Long,
                                        val unit: String)

data class CircleHealthTypeRepresentation(val unit: String,
                                          val circleComponents: List<CircleComponentHealthRepresentation>)

data class CircleComponentHealthRepresentation(val name: String,
                                               val threshold: Int,
                                               val value: Double,
                                               val status: HealthStatus)
