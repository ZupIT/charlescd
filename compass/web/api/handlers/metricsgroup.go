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
	"github.com/labstack/echo/v4"
	"net/http"

	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
)

func GetAll(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		workspaceId := echoCtx.Request().Header.Get("x-workspace-id")

		parsedWorkspaceId, parseErr := uuid.Parse(workspaceId)
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		list, err := metricsgroupMain.FindAllByWorkspaceId(parsedWorkspaceId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, list)
	}
}

func Resume(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		circleId := echoCtx.QueryParam("circleId")

		metricGroups, err := metricsgroupMain.ResumeByCircle(circleId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, metricGroups)
	}
}

func CreateMetricsGroup(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		metricsGroup, err := metricsgroupMain.Parse(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		workspaceID := echoCtx.Request().Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}
		metricsGroup.WorkspaceID = workspaceUUID

		if err := metricsgroupMain.Validate(metricsGroup); len(err.Get().Errors) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		createdCircle, err := metricsgroupMain.Save(metricsGroup)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, createdCircle)
	}
}

func Show(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricGroupID")

		metricsGroup, err := metricsgroupMain.FindById(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, metricsGroup)
	}
}

func Query(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricGroupID")

		periodParameter := echoCtx.QueryParam("period")
		intervalParameter := echoCtx.QueryParam("interval")
		if periodParameter == "" || intervalParameter == "" {
			return echoCtx.JSON(http.StatusInternalServerError, errors.NewError("Invalid parameters", "Period or interval params is required"))
		}

		ragePeriod, err := metricsgroupMain.PeriodValidate(periodParameter)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		interval, err := metricsgroupMain.PeriodValidate(intervalParameter)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		queryResult, err := metricsgroupMain.QueryByGroupID(id, ragePeriod, interval)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, queryResult)
	}
}

func Result(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricGroupID")

		queryResult, err := metricsgroupMain.ResultByID(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, queryResult)
	}
}

func UpdateMetricsGroup(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricGroupID")

		metricsGroup, err := metricsgroupMain.Parse(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		updatedWorkspace, err := metricsgroupMain.Update(id, metricsGroup)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, updatedWorkspace)
	}
}

func UpdateName(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricGroupID")
		metricsGroupAux, err := metricsgroupMain.Parse(echoCtx.Request().Body)

		metricsGroup, err := metricsgroupMain.FindById(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		metricsGroup.Name = metricsGroupAux.Name
		if err := metricsgroupMain.Validate(metricsGroup); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		updatedWorkspace, err := metricsgroupMain.UpdateName(id, metricsGroup)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}
		return echoCtx.JSON(http.StatusOK, updatedWorkspace)
	}
}

func DeleteMetricsGroup(metricsgroupMain metricsgroup.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricGroupID")

		err := metricsgroupMain.Remove(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
