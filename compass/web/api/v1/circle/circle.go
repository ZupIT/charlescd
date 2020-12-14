package circle

import (
	"net/http"

	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/web/api/util"
	"github.com/gorilla/mux"
)

func ListMetricGroupInCircle(metricsgroupMain metricsgroup.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["circleID"]
		list, err := metricsgroupMain.ListAllByCircle(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, list)
	}
}
