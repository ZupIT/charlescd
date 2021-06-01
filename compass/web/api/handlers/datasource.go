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
	"github.com/labstack/echo/v4"
	"net/http"

	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/google/uuid"
)

func FindAllByWorkspace(datasourceMain datasource.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		workspaceID := echoCtx.Request().Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		dataSources, dbErr := datasourceMain.FindAllByWorkspace(workspaceUUID)
		if dbErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, []error{errors.New("error doing the process")})
		}

		return echoCtx.JSON(http.StatusOK, dataSources)
	}
}

func CreateDatasource(datasourceMain datasource.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		dataSource, err := datasourceMain.Parse(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}
		workspaceID := echoCtx.Request().Header.Get("x-workspace-id")
		workspaceUUID := uuid.MustParse(workspaceID)

		dataSource.WorkspaceID = workspaceUUID
		if err := datasourceMain.Validate(dataSource); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		createdDataSource, err := datasourceMain.Save(dataSource)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, createdDataSource)
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

func DeleteDatasource(datasourceMain datasource.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		id := echoCtx.Param("datasourceID")
		err := datasourceMain.Delete(id)
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
