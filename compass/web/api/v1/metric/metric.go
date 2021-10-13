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

package metric

import (
	"net/http"

	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/web/api/util"
)

func Create(metricMain metric.UseCases, metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		metricGroupID := mux.Vars(r)["metricGroupID"]

		newMetric, err := metricMain.ParseMetric(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		metricGroup, err := metricsgroupMain.FindByID(metricGroupID)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		newMetric.MetricsGroupID = uuid.MustParse(metricGroupID)
		newMetric.CircleID = metricGroup.CircleID

		if err := metricMain.Validate(newMetric); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		list, err := metricMain.SaveMetric(newMetric)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusCreated, list)
	}
}

func Update(metricMain metric.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		metricID := mux.Vars(r)["metricID"]
		metricGroupID := mux.Vars(r)["metricGroupID"]

		newMetric, err := metricMain.ParseMetric(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		if err := metricMain.Validate(newMetric); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		newMetric.ID = uuid.MustParse(metricID)
		newMetric.MetricsGroupID = uuid.MustParse(metricGroupID)
		updateMetric, err := metricMain.UpdateMetric(newMetric)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		util.NewResponse(w, http.StatusOK, updateMetric)
	}
}

func Delete(metricMain metric.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		metricID := mux.Vars(r)["metricID"]
		err := metricMain.RemoveMetric(metricID)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusNoContent, nil)
	}
}
