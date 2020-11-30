package metricsgroup

import (
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"net/http"
)

func Create(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func GetAll(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
