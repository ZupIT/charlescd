package v1

import (
	"compass/internal/plugin"
	"compass/web/api"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type HealthApi struct {
	healthMain plugin.UseCases
}

func (v1 V1) NewHealthApi(healthMain plugin.UseCases) HealthApi {
	apiPath := "/application-health"
	healthApi := HealthApi{healthMain}
	v1.Router.GET(v1.getCompletePath(apiPath)+"/:circleId/components", api.HttpValidator(healthApi.components))
	v1.Router.GET(v1.getCompletePath(apiPath)+"/:circleId/components/health", api.HttpValidator(healthApi.list))
	return healthApi
}

func (healthApi HealthApi) components(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	projectionType := r.URL.Query().Get("projectionType")
	metricType := r.URL.Query().Get("metricType")

	circles, err := healthApi.healthMain.FindAll(category)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, circles)
}
