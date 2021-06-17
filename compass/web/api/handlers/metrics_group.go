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
	metricsGroupInteractor "github.com/ZupIT/charlescd/compass/internal/use_case/metrics_group"
	"github.com/ZupIT/charlescd/compass/web/api/handlers/representation"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetAll(findAllMetricsGroup metricsGroupInteractor.FindAllMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		workspaceId, err := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		list, err := findAllMetricsGroup.Execute(workspaceId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricsGroupToResponses(list))
	}
}

func Resume(resumeByCircle metricsGroupInteractor.ResumeByCircleMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		circleId, err := uuid.Parse(echoCtx.QueryParam("circleId"))
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		metricGroups, err := resumeByCircle.Execute(circleId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricGroupResumeToResponses(metricGroups))
	}
}

func CreateMetricsGroup(createMetricsGroup metricsGroupInteractor.CreateMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()
		var metricsGroup representation.MetricsGroupRequest

		bindErr := echoCtx.Bind(&metricsGroup)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, nil))
		}

		validationErr := echoCtx.Validate(metricsGroup)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "createDatasource.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		workspaceId, parseErr := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Workspace-Id is invalid", bindErr, nil))
		}

		savedMetricsGroup, err := createMetricsGroup.Execute(metricsGroup.RequestToDomain(workspaceId))
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricsGroupToResponse(savedMetricsGroup))
	}
}

func Show(getMetricsGroup metricsGroupInteractor.GetMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		metricsGroup, err := getMetricsGroup.Execute(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricsGroupToResponse(metricsGroup))
	}
}

func Query(queryMetricsGroup metricsGroupInteractor.QueryMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		periodParameter := echoCtx.QueryParam("period")
		intervalParameter := echoCtx.QueryParam("interval")

		queryResult, err := queryMetricsGroup.Execute(id, periodParameter, intervalParameter)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricValuesDomainToResponses(queryResult))
	}
}

func Result(resultMetrics metricsGroupInteractor.ResultMetrics) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		queryResult, err := resultMetrics.Execute(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricResultToResponses(queryResult))
	}
}

func UpdateMetricsGroup(updateMetricsGroup metricsGroupInteractor.UpdateMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		ctx := echoCtx.Request().Context()
		var metricsGroup representation.MetricsGroupUpdateRequest

		bindErr := echoCtx.Bind(&metricsGroup)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, nil))
		}

		updatedMetricsGroup, err := updateMetricsGroup.Execute(id, metricsGroup.RequestToDomain())
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricsGroupToResponse(updatedMetricsGroup))
	}
}

func UpdateName(updateNameMetricsGroup metricsGroupInteractor.UpdateNameMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		ctx := echoCtx.Request().Context()
		var metricsGroupRequest representation.MetricsGroupRequest

		bindErr := echoCtx.Bind(&metricsGroupRequest)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, nil))
		}

		workspaceId, parseErr := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Workspace-Id is invalid", bindErr, nil))
		}

		validationErr := echoCtx.Validate(metricsGroupRequest)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "createDatasource.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		updatedWorkspace, err := updateNameMetricsGroup.Execute(id, metricsGroupRequest.RequestToDomain(workspaceId))
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.MetricsGroupToResponse(updatedWorkspace))
	}
}

func DeleteMetricsGroup(deleteMetricsGroup metricsGroupInteractor.DeleteMetricsGroup) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		err := deleteMetricsGroup.Execute(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
