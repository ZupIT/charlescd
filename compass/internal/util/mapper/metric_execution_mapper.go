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

package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func MetricExecutionDomainToModel(metricExecution domain.MetricExecution) models.MetricExecution {
	return models.MetricExecution{
		BaseModel: metricExecution.BaseModel,
		MetricID:  metricExecution.MetricID,
		LastValue: metricExecution.LastValue,
		Status:    metricExecution.Status,
	}
}

func MetricExecutionModelToDomain(metricExecution models.MetricExecution) domain.MetricExecution {
	return domain.MetricExecution{
		BaseModel: metricExecution.BaseModel,
		MetricID:  metricExecution.MetricID,
		LastValue: metricExecution.LastValue,
		Status:    metricExecution.Status,
	}
}

func MetricExecutionModelToDomains(metricExecution []models.MetricExecution) []domain.MetricExecution {
	metricExecutionList := make([]domain.MetricExecution, 0)
	for _, mg := range metricExecution {
		metricExecutionList = append(metricExecutionList, MetricExecutionModelToDomain(mg))
	}
	return metricExecutionList
}
