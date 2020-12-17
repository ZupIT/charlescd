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
		metricgroupId := mux.Vars(r)["metricGroupID"]

		newMetric, err := metricMain.ParseMetric(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		if err := metricMain.Validate(newMetric); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		metricGroup, err := metricsgroupMain.FindById(metricgroupId)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		newMetric.MetricsGroupID = uuid.MustParse(metricgroupId)
		newMetric.CircleID = metricGroup.CircleID
		list, err := metricMain.SaveMetric(newMetric)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusCreated, list)
	}
}

func Update(metricMain metric.UseCases, metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		metricgroupId := mux.Vars(r)["metricGroupID"]
		metricId := mux.Vars(r)["metricID"]

		newMetric, err := metricMain.ParseMetric(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		if err := metricMain.Validate(newMetric); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		metricGroup, err := metricsgroupMain.FindById(metricgroupId)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		newMetric.ID = uuid.MustParse(metricId)
		newMetric.MetricsGroupID = uuid.MustParse(metricgroupId)
		newMetric.CircleID = metricGroup.CircleID
		updateMetric, err := metricMain.SaveMetric(newMetric)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, updateMetric)
	}
}

func Delete(metricMain metric.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		metricId := mux.Vars(r)["metricID"]
		err := metricMain.RemoveMetric(metricId)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusNoContent, nil)
	}
}
