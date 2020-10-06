package v1

import (
	"compass/internal/action"
	"compass/web/api"
	"errors"
	"github.com/google/uuid"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type ActionApi struct {
	actionMain action.UseCases
}

func (v1 V1) NewActionApi(actionMain action.UseCases) ActionApi {
	apiPath := "/actions"
	actionApi := ActionApi{actionMain}

	v1.Router.GET(v1.getCompletePath(apiPath), api.HttpValidator(actionApi.list))
	v1.Router.POST(v1.getCompletePath(apiPath), api.HttpValidator(actionApi.create))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(actionApi.delete))

	return actionApi
}

func (actionApi ActionApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	request, err := actionApi.actionMain.ParseAction(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("invalid payload")})
		return
	}

	workspaceUuid, err := uuid.Parse(workspaceId)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("invalid workspaceID")})
		return
	}
	request.WorkspaceId = workspaceUuid

	if err := actionApi.actionMain.ValidateAction(request); len(err) > 0 {
		api.NewRestValidateError(w, http.StatusInternalServerError, err, "could not save action")
		return
	}

	createdAction, err := actionApi.actionMain.SaveAction(request)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error saving action")})
		return
	}

	api.NewRestSuccess(w, http.StatusCreated, createdAction)
}

func (actionApi ActionApi) list(w http.ResponseWriter, _ *http.Request, _ httprouter.Params, workspaceId string) {
	actions, err := actionApi.actionMain.FindAllActionsByWorkspace(workspaceId)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error listing actions")})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, actions)
}

func (actionApi ActionApi) delete(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ string) {
	err := actionApi.actionMain.DeleteAction(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error deleting action")})
		return
	}

	api.NewRestSuccess(w, http.StatusNoContent, nil)
}
