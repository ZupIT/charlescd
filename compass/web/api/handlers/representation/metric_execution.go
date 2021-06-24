/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
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
 */

package representation

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
)

type MetricExecutionRequest struct {
	LastValue float64 `json:"lastValue"`
	Status    string  `json:"status"`
}

type MetricExecutionResponse struct {
	LastValue float64 `json:"lastValue"`
	Status    string  `json:"status"`
}

func (metricExecutionRequest MetricExecutionRequest) MetricExecutionRequestToDomain() domain.MetricExecution {
	return domain.MetricExecution{
		LastValue: metricExecutionRequest.LastValue,
		Status:    metricExecutionRequest.Status,
	}
}

func MetricExecutionDomainToResponse(metricExecution domain.MetricExecution) MetricExecutionResponse {
	return MetricExecutionResponse{
		LastValue: metricExecution.LastValue,
		Status:    metricExecution.Status,
	}
}
