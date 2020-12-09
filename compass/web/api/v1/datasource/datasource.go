package datasource

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/google/uuid"
	"github.com/julienschmidt/httprouter"
)

func FindAllByWorkspace(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		dataSources, dbErr := dataSourceApi.dataSourceMain.FindAllByWorkspace(workspaceID, r.URL.Query().Get("healthy"))
		if dbErr != nil {
			api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("error doing the process")})
			return
		}

		api.NewRestSuccess(w, http.StatusOK, dataSources)
	}
}

type TestConnection struct {
	PluginSrc string          `json:"pluginSrc"`
	Data      json.RawMessage `json:"data"`
}

func testConnection(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var newTestConnection TestConnection
		err := json.NewDecoder(r.Body).Decode(&newTestConnection)
		if err != nil {
			api.NewRestError(w, http.StatusInternalServerError, []error{err})
			return
		}

		err = dataSourceApi.dataSourceMain.TestConnection(newTestConnection.PluginSrc, newTestConnection.Data)
		if err != nil {
			api.NewRestError(w, http.StatusInternalServerError, []error{err})
			return
		}

		api.NewRestSuccess(w, http.StatusNoContent, nil)
	}
}

func create(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		dataSource, err := dataSourceApi.dataSourceMain.Parse(r.Body)
		if err != nil {
			api.NewRestError(w, http.StatusInternalServerError, []error{err})
			return
		}
		dataSource.WorkspaceID = workspaceID

		if err := dataSourceApi.dataSourceMain.Validate(dataSource); len(err) > 0 {
			api.NewRestValidateError(w, http.StatusInternalServerError, err, "Could not create datasource")
			return
		}

		createdDataSource, err := dataSourceApi.dataSourceMain.Save(dataSource)
		if err != nil {
			api.NewRestError(w, http.StatusInternalServerError, []error{err})
			return
		}

		api.NewRestSuccess(w, http.StatusOK, createdDataSource)
	}
}

func deleteDataSource(w http.ResponseWriter, r *http.Request, ps httprouter.Params, _ uuid.UUID) {
	err := dataSourceApi.dataSourceMain.Delete(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func getMetrics(w http.ResponseWriter, _ *http.Request, ps httprouter.Params, _ uuid.UUID) {
	metrics, err := dataSourceApi.dataSourceMain.GetMetrics(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, []error{err})
		return
	}
	api.NewRestSuccess(w, http.StatusOK, metrics)
}
