package datasource

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/ZupIT/charlescd/compass/web/api/util"
	"github.com/gorilla/mux"

	"github.com/ZupIT/charlescd/compass/internal/datasource"
	"github.com/google/uuid"
)

func FindAllByWorkspace(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}

		dataSources, dbErr := datasourceMain.FindAllByWorkspace(workspaceUUID, r.URL.Query().Get("healthy"))
		if dbErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, []error{errors.New("error doing the process")})
			return
		}

		util.NewResponse(w, http.StatusOK, dataSources)
	}
}

type TestConnectionData struct {
	PluginSrc string          `json:"pluginSrc"`
	Data      json.RawMessage `json:"data"`
}

func TestConnection(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var newTestConnection TestConnectionData
		err := json.NewDecoder(r.Body).Decode(&newTestConnection)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, []error{err})
			return
		}

		testConnErr := datasourceMain.TestConnection(newTestConnection.PluginSrc, newTestConnection.Data)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, testConnErr)
			return
		}

		util.NewResponse(w, http.StatusNoContent, nil)
	}
}

func Create(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		dataSource, err := datasourceMain.Parse(r.Body)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}
		dataSource.WorkspaceID = workspaceUUID

		if err := datasourceMain.Validate(dataSource); len(err.GetErrors()) > 0 {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		createdDataSource, err := datasourceMain.Save(dataSource)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, createdDataSource)
	}
}

func Delete(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["datasourceID"]
		err := datasourceMain.Delete(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		util.NewResponse(w, http.StatusNoContent, nil)
	}
}

func GetMetrics(datasourceMain datasource.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["datasourceID"]
		metrics, err := datasourceMain.GetMetrics(id)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}
		util.NewResponse(w, http.StatusOK, metrics)
	}
}
