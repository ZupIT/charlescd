package v1

import (
	"compass/internal/metricsgroupaction"
	"compass/web/api"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type MetricsGroupActionApi struct {
	main metricsgroupaction.UseCases
}

func (v1 V1) NewMetricsGroupActionApi(main metricsgroupaction.UseCases) MetricsGroupActionApi {
	apiPath := "/actions-execution"
	metricsGroupActionApi := MetricsGroupActionApi{main}

	v1.Router.GET(v1.getCompletePath(apiPath), api.HttpValidator(metricsGroupActionApi.List))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(metricsGroupActionApi.FindById))
	v1.Router.POST(v1.getCompletePath(apiPath), api.HttpValidator(metricsGroupActionApi.Create))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(metricsGroupActionApi.Delete))
	return metricsGroupActionApi
}

func (metricsGroupActionApi MetricsGroupActionApi) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	act, err := metricsGroupActionApi.main.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	if err := metricsGroupActionApi.main.Validate(act); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "Could not save action")
		return
	}

	createdCircle, err := metricsGroupActionApi.main.Save(act)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, createdCircle)
}

func (metricsGroupActionApi MetricsGroupActionApi) List(w http.ResponseWriter, _ *http.Request, _ httprouter.Params, workspaceId string) {
	actions, err := metricsGroupActionApi.main.FindAll()
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, actions)
}

func (metricsGroupActionApi MetricsGroupActionApi) FindById(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	id := ps.ByName("id")

	act, err := metricsGroupActionApi.main.FindById(id)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, act)
}

func (metricsGroupActionApi MetricsGroupActionApi) Delete(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	err := metricsGroupActionApi.main.Delete(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	api.NewRestSuccess(w, http.StatusNoContent, nil)
}
