/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
