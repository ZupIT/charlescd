/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"github.com/ZupIT/charlescd/gate/internal/logging"
	authorizationInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	"github.com/labstack/echo/v4"
	"net/http"
)

func DoAuthorization(authorizeUserToken authorizationInteractor.AuthorizeUserToken, authorizeSystemToken authorizationInteractor.AuthorizeSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		var request representation.AuthorizationRequest
		bindErr := echoCtx.Bind(&request)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusBadRequest, logging.NewError("Cant parse body", bindErr, logging.ParseError, nil))
		}

		validationErr := echoCtx.Validate(request)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "authorizeUserToken.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusBadRequest, validationErr)
		}

		var systemToken = echoCtx.Request().Header.Get("x-charles-token")
		var workspaceID = echoCtx.Request().Header.Get("x-workspace-id")

		if systemToken != "" {
			err := authorizeSystemToken.Execute(systemToken, workspaceID, request.RequestToDomain())
			if err != nil {
				return HandleError(echoCtx, ctx, err)
			}
		} else {
			var userToken = echoCtx.Request().Header.Get("Authorization")

			err := authorizeUserToken.Execute(userToken, workspaceID, request.RequestToDomain())
			if err != nil {
				return HandleError(echoCtx, ctx, err)
			}
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
