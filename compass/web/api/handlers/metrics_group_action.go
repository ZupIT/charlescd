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
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func CreateMetricsGroupAction(metricsgroupactionMain metricsgroupaction.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		newActionGroup, err := metricsgroupactionMain.ParseGroupAction(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		workspaceID := echoCtx.Request().Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		newActionGroup.ActionsConfiguration = metricsgroupaction.ActionsConfiguration{
			Repeatable:     false,
			NumberOfCycles: 1,
		}

		if err := metricsgroupactionMain.ValidateGroupAction(newActionGroup, workspaceUUID); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		created, err := metricsgroupactionMain.SaveGroupAction(newActionGroup)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, created)
	}
}

func Update(metricsgroupactionMain metricsgroupaction.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricgroupactionID")

		newActionGroup, err := metricsgroupactionMain.ParseGroupAction(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		newActionGroup.ActionsConfiguration = metricsgroupaction.ActionsConfiguration{
			Repeatable:     false,
			NumberOfCycles: 1,
		}

		workspaceID := echoCtx.Request().Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		if err := metricsgroupactionMain.ValidateGroupAction(newActionGroup, workspaceUUID); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		updated, err := metricsgroupactionMain.UpdateGroupAction(id, newActionGroup)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, updated)
	}
}

func FindByID(metricsgroupactionMain metricsgroupaction.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricgroupactionID")

		act, err := metricsgroupactionMain.FindGroupActionById(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, act)
	}
}

func DeleteMetricsGroupAction(metricsgroupactionMain metricsgroupaction.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("metricgroupactionID")

		err := metricsgroupactionMain.DeleteGroupAction(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
