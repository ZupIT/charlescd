package v1

import (
	"compass/internal/plugin"
	"compass/web/api"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type PluginApi struct {
	pluginMain plugin.UseCases
}

func (v1 V1) NewPluginApi(pluginMain plugin.UseCases) PluginApi {
	apiPath := "/plugins"
	pluginApi := PluginApi{pluginMain}
	v1.Router.GET(v1.getCompletePath(apiPath), api.HttpValidator(pluginApi.list))
	return pluginApi
}

func (pluginApi PluginApi) list(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	circles, err := pluginApi.pluginMain.FindAll()
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, circles)
}
