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

package logging

import (
	"context"
	"github.com/ZupIT/charlescd/gate/internal/configuration"
	"go.uber.org/zap"
)

type LoggerType string

const LoggerFlag = LoggerType("api-logger-context")

func NewLogger() (*zap.Logger, error) {
	var config zap.Config
	if configuration.IsRunningInProduction() {
		config = zap.NewProductionConfig()
	} else {
		config = zap.NewDevelopmentConfig()
	}
	config.DisableStacktrace = true

	logger, err := config.Build()
	if err != nil {
		return nil, err
	}

	return logger, nil
}

func LoggerFromContext(ctx context.Context) (*zap.SugaredLogger, bool) {
	logger, ok := ctx.Value(LoggerFlag).(*zap.SugaredLogger)
	return logger, ok
}

func LogErrorFromCtx(ctx context.Context, err error) {
	if logger, okLogger := LoggerFromContext(ctx); okLogger {
		internalErr, okErr := err.(*CustomError)
		if okErr {
			logger.Errorw(internalErr.Message,
				"error-id", internalErr.ID,
				"details", internalErr.Detail,
				"operations", internalErr.Operations,
				"meta-info", internalErr.Meta)
			return
		}

		logger.Error(err)
	}
}
