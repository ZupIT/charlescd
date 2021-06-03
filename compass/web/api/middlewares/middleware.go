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

package middlewares

import (
	"context"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"strconv"
	"time"
)

func RequestLimiter(next echo.HandlerFunc) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		requestLimiter := configureRequestLimiter()

		reqErr := tollbooth.LimitByRequest(requestLimiter, echoCtx.Response().Writer, echoCtx.Request())
		if reqErr != nil {
			return echoCtx.JSON(http.StatusForbidden, logging.NewError("Not allowed", reqErr, nil))
		}

		return next(echoCtx)
	}
}

func ContextLogger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		logger, err := logging.NewLogger()
		if err != nil {
			return err
		}
		defer logger.Sync()

		sugar := logger.Sugar().With("request-id", echoCtx.Response().Header().Get("x-request-id"))

		ctx := context.WithValue(echoCtx.Request().Context(), logging.LoggerFlag, sugar)
		echoCtx.SetRequest(echoCtx.Request().Clone(ctx))

		return next(echoCtx)
	}
}

func Logger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		start := time.Now()
		err := next(echoCtx)

		ctx := echoCtx.Request().Context()

		req := echoCtx.Request()
		resp := echoCtx.Response()

		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			echoCtx.Error(err)
		}

		if logger, ok := logging.LoggerFromContext(ctx); ok {
			logger.Infow("finished request",
				"path", req.RequestURI,
				"method", req.Method,
				"status", strconv.Itoa(resp.Status),
				"time", time.Since(start).String())
		}

		return nil
	}
}

func configureRequestLimiter() *limiter.Limiter {
	reqLimit, err := strconv.ParseFloat(configuration.Get("REQUESTS_PER_SECOND_LIMIT"), 64)
	if err != nil {
		log.Fatal(err)
	}

	tokenTTL, err := strconv.Atoi(configuration.Get("LIMITER_TOKEN_TTL"))
	if err != nil {
		log.Fatal(err)
	}

	headersTTL, err := strconv.Atoi(configuration.Get("LIMITER_HEADERS_TTL"))
	if err != nil {
		log.Fatal(err)
	}

	lmt := tollbooth.NewLimiter(reqLimit, nil)
	lmt.SetTokenBucketExpirationTTL(time.Duration(tokenTTL) * time.Minute)
	lmt.SetHeaderEntryExpirationTTL(time.Duration(headersTTL) * time.Minute)

	return lmt
}
