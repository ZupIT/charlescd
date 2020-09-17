package v1

import (
	"compass/internal/action"
	"compass/web/api"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type ActionApi struct {
	actionMain action.UseCases
}

func (v1 V1) NewActionApi(actionMain action.UseCases) ActionApi {
	apiPath := "/actions"
	actionApi := ActionApi{actionMain}

	v1.Router.GET(v1.getCompletePath(apiPath), api.HttpValidator(actionApi.List))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(actionApi.FindById))
	v1.Router.POST(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(actionApi.Create))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(actionApi.Create))
	return actionApi
}

func (actionApi ActionApi) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	act, err := actionApi.actionMain.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	if err := actionApi.actionMain.Validate(act); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "Could not save action")
		return
	}

	createdCircle, err := actionApi.actionMain.Save(act)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, createdCircle)
}

func (actionApi ActionApi) List(w http.ResponseWriter, _ *http.Request, _ httprouter.Params, workspaceId string) {
	actions, err := actionApi.actionMain.FindAll()
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, actions)
}

func (actionApi ActionApi) FindById(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	id := ps.ByName("id")

	act, err := actionApi.actionMain.FindById(id)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, act)
}

func (actionApi ActionApi) Delete(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	err := actionApi.actionMain.Delete(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	api.NewRestSuccess(w, http.StatusNoContent, nil)
}
