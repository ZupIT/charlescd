package v1

import (
	"compass/internal/metricsgroupaction"
	"compass/web/api"
	"errors"
	"github.com/google/uuid"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type MetricsGroupActionApi struct {
	main metricsgroupaction.UseCases
}

func (v1 V1) NewMetricsGroupActionApi(main metricsgroupaction.UseCases) MetricsGroupActionApi {
	apiPath := "/group-actions"
	metricsGroupActionApi := MetricsGroupActionApi{main}

	v1.Router.POST(v1.getCompletePath(apiPath), api.HttpValidator(metricsGroupActionApi.create))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(metricsGroupActionApi.delete))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(metricsGroupActionApi.findById))
	v1.Router.PUT(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(metricsGroupActionApi.update))

	return metricsGroupActionApi
}

func (metricsGroupActionApi MetricsGroupActionApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceID string) {
	act, err := metricsGroupActionApi.main.ParseGroupAction(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("invalid payload")})
		return
	}

	act.Configuration = metricsgroupaction.ActionsConfigurations{
		Repeatable:     false,
		NumberOfCycles: 1,
	}

	if err := metricsGroupActionApi.main.ValidateGroupAction(act, workspaceID); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "could not save action")
		return
	}

	_, err = metricsGroupActionApi.main.SaveGroupAction(act)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error creating action")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, act)
}

func (metricsGroupActionApi MetricsGroupActionApi) delete(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ string) {
	err := metricsGroupActionApi.main.DeleteGroupAction(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error deleting action")})
		return
	}
	api.NewRestSuccess(w, http.StatusNoContent, nil)
}

func (metricsGroupActionApi MetricsGroupActionApi) findById(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ string) {
	id := ps.ByName("id")

	act, err := metricsGroupActionApi.main.FindGroupActionById(id)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error finding action")})
		return
	} else if act.ID == uuid.Nil {
		api.NewRestError(w, http.StatusNotFound, []error{errors.New("action not found")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, act)
}

func (metricsGroupActionApi MetricsGroupActionApi) update(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceID string) {
	id := ps.ByName("id")
	act, err := metricsGroupActionApi.main.ParseGroupAction(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("invalid payload")})
		return
	}

	act.Configuration = metricsgroupaction.ActionsConfigurations{
		Repeatable:     false,
		NumberOfCycles: 1,
	}

	if err := metricsGroupActionApi.main.ValidateGroupAction(act, workspaceID); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "could not save action")
		return
	}

	groupActResp, err := metricsGroupActionApi.main.UpdateGroupAction(id, act)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error updating action")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, groupActResp)
}
