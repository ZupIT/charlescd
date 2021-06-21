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
	metricsGroupActionInteractor "github.com/ZupIT/charlescd/compass/internal/use_case/metrics_group_action"
	"github.com/ZupIT/charlescd/compass/web/api/handlers/representation"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func CreateMetricsGroupAction(createMetricGroupAction metricsGroupActionInteractor.CreateMetricGroupAction) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()

		request, err := Parse(echoCtx.Request().Body, new(representation.MetricsGroupActionRequest))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", err, nil))
		}
		action := request.(*representation.MetricsGroupActionRequest)

		workspaceId, parseErr := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		created, err := createMetricGroupAction.Execute(action.MetricsGroupActionRequestToDomain(), workspaceId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, representation.MetricsGroupActionDomainToResponse(created))
	}
}

func Update(updateMetricGroupAction metricsGroupActionInteractor.UpdateMetricGroupAction) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricgroupactionID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		workspaceId, parseErr := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		ctx := echoCtx.Request().Context()

		request, err := Parse(echoCtx.Request().Body, new(representation.MetricsGroupActionRequest))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", err, nil))
		}
		action := request.(*representation.MetricsGroupActionRequest)

		updated, err := updateMetricGroupAction.Execute(action.MetricsGroupActionRequestToDomain(), id, workspaceId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricsGroupActionDomainToResponse(updated))
	}
}

func FindByID(findMetricsGroupActionById metricsGroupActionInteractor.FindMetricsGroupActionById) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricgroupactionID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		act, err := findMetricsGroupActionById.Execute(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricsGroupActionDomainToResponse(act))
	}
}

func DeleteMetricsGroupAction(deleteMetricsGroupAction metricsGroupActionInteractor.DeleteMetricsGroupAction) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricgroupactionID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		err := deleteMetricsGroupAction.Execute(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
