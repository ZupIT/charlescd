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
	v1.Router.POST(v1.getCompletePath(apiPath), api.HttpValidator(pluginApi.create))
	v1.Router.GET(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(pluginApi.show))
	v1.Router.PATCH(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(pluginApi.update))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(pluginApi.delete))
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

func (pluginApi PluginApi) create(w http.ResponseWriter, r *http.Request, _ httprouter.Params, workspaceId string) {
	plugin, err := pluginApi.pluginMain.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	if err := plugin.Validate(); len(err) > 0 {
		api.NewRestError(w, http.StatusBadRequest, err)
		return
	}

	createdCircle, err := pluginApi.pluginMain.Save(plugin)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, createdCircle)
}

func (pluginApi PluginApi) show(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	id := ps.ByName("id")
	plugin, err := pluginApi.pluginMain.FindById(id)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, plugin)
}

func (pluginApi PluginApi) update(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	id := ps.ByName("id")
	plugin, err := pluginApi.pluginMain.Parse(r.Body)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	updatedWorkspace, err := pluginApi.pluginMain.Update(string(id), plugin)
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusOK, updatedWorkspace)
}

func (pluginApi PluginApi) delete(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string) {
	id := ps.ByName("id")
	err := pluginApi.pluginMain.Remove(string(id))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}

	api.NewRestSuccess(w, http.StatusNoContent, nil)
}
