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
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func Create(actionMain action.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		request, err := actionMain.ParseAction(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}
		workspaceID := echoCtx.Request().Header.Get("x-workspace-id")
		request.WorkspaceId = uuid.MustParse(workspaceID)

		if err := actionMain.ValidateAction(request); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		createdAction, err := actionMain.SaveAction(request)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, createdAction)
	}
}

func List(actionMain action.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		workspaceID := echoCtx.Request().Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		actions, err := actionMain.FindAllActionsByWorkspace(workspaceUUID)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, actions)
	}
}

func Delete(actionMain action.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("actionId")

		err := actionMain.DeleteAction(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
