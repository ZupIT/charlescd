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
	"encoding/json"
	"errors"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	datasourceInteractor "github.com/ZupIT/charlescd/compass/use_case/datasource"
	"github.com/ZupIT/charlescd/compass/web/api/handlers/representation"
	"github.com/labstack/echo/v4"
	"net/http"

	"github.com/google/uuid"
)

func FindAllByWorkspace(findAllDatasource datasourceInteractor.FindAllDatasource) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()

		workspaceId, err := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		dataSources, dbErr := findAllDatasource.Execute(workspaceId)
		if dbErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, []error{errors.New("error doing the process")})
		}

		return echoCtx.JSON(http.StatusOK, dataSources)
	}
}

func CreateDatasource(saveDatasource datasourceInteractor.SaveDatasource) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		var dataSource representation.DatasourceRequest

		bindErr := echoCtx.Bind(&dataSource)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, nil))
		}

		validationErr := echoCtx.Validate(dataSource)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "createDatasource.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		workspaceId, err := uuid.Parse(echoCtx.Request().Header.Get("x-workspace-id"))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		createdDatasource, err := saveDatasource.Execute(dataSource.RequestToDomain(workspaceId))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, representation.FromDomainToResponse(createdDatasource))
	}
}

type TestConnectionData struct {
	PluginSrc string          `json:"pluginSrc"`
	Data      json.RawMessage `json:"data"`
}

func TestConnection(datasourceMain datasource.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		var newTestConnection TestConnectionData
		err := json.NewDecoder(echoCtx.Request().Body).Decode(&newTestConnection)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, []error{err})
		}

		testConnErr := datasourceMain.TestConnection(newTestConnection.PluginSrc, newTestConnection.Data)
		if testConnErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, testConnErr)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}

func DeleteDatasource(deleteDatasource datasourceInteractor.DeleteDatasource) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		id, parseErr := uuid.Parse(echoCtx.Param("datasourceID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		err := deleteDatasource.Execute(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}

func GetMetrics(datasourceMain datasource.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("datasourceID")

		metrics, err := datasourceMain.GetMetrics(id)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, metrics)
	}
}
