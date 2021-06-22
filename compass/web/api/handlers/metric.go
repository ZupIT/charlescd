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

package handlers

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	metricInteractor "github.com/ZupIT/charlescd/compass/internal/use_case/metric"
	"github.com/ZupIT/charlescd/compass/web/api/handlers/representation"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func CreateMetric(createMetric metricInteractor.CreateMetric) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()
		var metric representation.MetricRequest

		bindErr := echoCtx.Bind(&metric)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Can't parse body", bindErr, nil))
		}

		validationErr := echoCtx.Validate(metric)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "createMetric.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		metricgroupId, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			logging.LogErrorFromCtx(ctx, parseErr)
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		metricResult, err := createMetric.Execute(metric.MetricRequestToDomain(metricgroupId))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, representation.MetricDomainToResponse(metricResult))
	}
}

func UpdateMetric(updateMetric metricInteractor.UpdateMetric) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()
		var metric representation.MetricRequest

		metricId, parseErr := uuid.Parse(echoCtx.Param("metricID"))
		if parseErr != nil {
			logging.LogErrorFromCtx(ctx, parseErr)
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		metricgroupId, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			logging.LogErrorFromCtx(ctx, parseErr)
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		bindErr := echoCtx.Bind(&metric)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Can't parse body", bindErr, nil))
		}

		updatedMetric, err := updateMetric.Execute(metric.MetricUpdateRequestToDomain(metricId, metricgroupId))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricDomainToResponse(updatedMetric))
	}
}

func DeleteMetric(deleteMetric metricInteractor.DeleteMetric) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		metricId, parseErr := uuid.Parse(echoCtx.Param("metricID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		err := deleteMetric.Execute(metricId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
