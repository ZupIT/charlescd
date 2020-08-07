package v1

import (
	"compass/internal/metricsgroup"
	"compass/web/api"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type MetricsGroupApi struct {
	metricsGroupMain metricsgroup.UseCases
}

func (v1 V1) NewMetricsGroupApi(metricsGroupMain metricsgroup.UseCases) MetricsGroupApi {
	apiPath := "/metrics-groups"
	metricsGroupApi := MetricsGroupApi{metricsGroupMain}
	v1.Router.GET(v1.getCompletePath(apiPath), metricsGroupApi.list)
	v1.Router.POST(v1.getCompletePath(apiPath), metricsGroupApi.create)
	v1.Router.GET(v1.getCompletePath(apiPath+":id"), metricsGroupApi.show)
	v1.Router.PATCH(v1.getCompletePath(apiPath+":id"), metricsGroupApi.update)
	v1.Router.DELETE(v1.getCompletePath(apiPath+":id"), metricsGroupApi.delete)
	return metricsGroupApi
}

func (metricsGroupApi MetricsGroupApi) list(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	circles, err := metricsGroupApi.metricsGroupMain.FindAll()
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	api.NewRestSuccess(w, http.StatusOK, circles)
}

func (metricsGroupApi MetricsGroupApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	metricsGroup, err := metricsGroupApi.metricsGroupMain.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	if err := metricsGroup.Validate(); err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	createdCircle, err := metricsGroupApi.metricsGroupMain.Save(metricsGroup)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	api.NewRestSuccess(w, http.StatusOK, createdCircle)
}

func (metricsGroupApi MetricsGroupApi) show(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	metricsGroup, err := metricsGroupApi.metricsGroupMain.FindById(id)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	api.NewRestSuccess(w, http.StatusOK, metricsGroup)
}

func (metricsGroupApi MetricsGroupApi) update(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	metricsGroup, err := metricsGroupApi.metricsGroupMain.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	updatedWorkspace, err := metricsGroupApi.metricsGroupMain.Update(string(id), metricsGroup)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	api.NewRestSuccess(w, http.StatusOK, updatedWorkspace)
}

func (metricsGroupApi MetricsGroupApi) delete(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	err := metricsGroupApi.metricsGroupMain.Remove(string(id))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}

	api.NewRestSuccess(w, http.StatusNoContent, nil)
}
