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
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/labstack/echo/v4"
	"net/http"

	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/google/uuid"
)

func CreateMetric(metricMain metric.UseCases, metricsgroupMain repository.MetricsGroupRepository) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		metricgroupId := echoCtx.Param("metricGroupID")

		newMetric, err := metricMain.ParseMetric(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		metricGroup, err := metricsgroupMain.FindById(metricgroupId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		newMetric.MetricsGroupID = uuid.MustParse(metricgroupId)
		newMetric.CircleID = metricGroup.CircleID

		if err := metricMain.Validate(newMetric); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		list, err := metricMain.SaveMetric(newMetric)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, list)
	}
}

func UpdateMetric(metricMain metric.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		metricId := echoCtx.Param("metricID")
		metricGroupId := echoCtx.Param("metricGroupID")

		newMetric, err := metricMain.ParseMetric(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		if err := metricMain.Validate(newMetric); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		newMetric.ID = uuid.MustParse(metricId)
		newMetric.MetricsGroupID = uuid.MustParse(metricGroupId)

		updateMetric, err := metricMain.UpdateMetric(newMetric)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, updateMetric)
	}
}

func DeleteMetric(metricMain metric.UseCases) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		metricId := echoCtx.Param("metricID")

		err := metricMain.RemoveMetric(metricId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
