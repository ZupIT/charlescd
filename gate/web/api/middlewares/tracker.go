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

package middlewares

import (
	"context"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/labstack/echo/v4"
)

func ContextLogger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		logger, err := logging.NewLogger()
		if err != nil {
			return err
		}
		defer func() {
			err = logger.Sync()
		}()

		if err != nil {
			return err
		}
		sugar := logger.Sugar().With("request-id", echoCtx.Response().Header().Get("x-request-id"))
		ctx := context.WithValue(echoCtx.Request().Context(), logging.LoggerFlag, sugar)
		echoCtx.SetRequest(echoCtx.Request().Clone(ctx))

		return next(echoCtx)
	}
}
