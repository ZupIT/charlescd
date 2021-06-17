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
	actionInteractor "github.com/ZupIT/charlescd/compass/internal/use_case/action"
	"github.com/ZupIT/charlescd/compass/web/api/handlers/representation"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func Create(createAction actionInteractor.CreateAction) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()
		var action representation.ActionRequest

		bindErr := echoCtx.Bind(&action)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, nil))
		}

		workspaceId, err := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		createdAction, err := createAction.Execute(action.RequestToDomain(workspaceId))
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, representation.ActionDomainToResponse(createdAction))
	}
}

func List(listAction actionInteractor.ListAction) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		workspaceId, err := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		actions, err := listAction.Execute(workspaceId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.ActionDomainToResponses(actions))
	}
}

func Delete(deleteAction actionInteractor.DeleteAction) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("actionId"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		err := deleteAction.Execute(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
