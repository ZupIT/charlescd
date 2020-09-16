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
	return actionApi
}

func (actionApi ActionApi) List(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	//actions, err :=
}
