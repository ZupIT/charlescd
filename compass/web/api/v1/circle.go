package v1

import (
	"compass/internal/metricsgroup"
	"compass/web/api"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type CircleApi struct {
	circleMain metricsgroup.UseCases
}

func (v1 V1) NewCircleApi(circleMain metricsgroup.UseCases) CircleApi {
	apiPath := "/circles"
	circleApi := CircleApi{circleMain}
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/metrics-groups"), api.HttpValidator(circleApi.ListMetricsGroupInCircle))

	return circleApi
}

func (circleApi CircleApi) ListMetricsGroupInCircle(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	id := ps.ByName("id")
	metricsGroups, err := circleApi.circleMain.FindCircleMetricGroups(id)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, metricsGroups)
}
