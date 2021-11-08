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
	"context"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/labstack/echo/v4"
	"net/http"
)

func HandleError(echoCtx echo.Context, ctx context.Context, err error) error {
	logging.LogErrorFromCtx(ctx, err)
	return echoCtx.JSON(getErrorStatusCode(logging.GetErrorType(err)), err)
}

func getErrorStatusCode(errType string) int {
	switch errType {
	case logging.ParseError, logging.IllegalParamError:
		return http.StatusBadRequest
	case logging.BusinessError:
		return http.StatusUnprocessableEntity
	case logging.NotFoundError:
		return http.StatusNotFound
	case logging.ForbiddenError:
		return http.StatusForbidden
	default:
		return http.StatusInternalServerError
	}
}
