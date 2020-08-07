package v1

import (
	"compass/internal/datasource"
	"compass/web/api"
	"errors"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type dataSourceRepresentation struct {
	api.BaseEntityRepresentation
	Name   string `json:"name"`
	Health bool   `json:"health"`
}

type DataSourceApi struct {
	dataSourceMain datasource.UseCases
}

func (v1 V1) NewDataSourceApi(dataSourceMain datasource.UseCases) DataSourceApi {
	apiPath := "/datasource"
	dataSourceAPI := DataSourceApi{dataSourceMain}
	v1.Router.GET(v1.getCompletePath(apiPath), api.HttpValidator(dataSourceAPI.findAllByWorkspace))
	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), api.HttpValidator(dataSourceAPI.deleteDataSource))
	v1.Router.PATCH(v1.getCompletePath(apiPath+":id/define-health"), api.HttpValidator(dataSourceAPI.deleteDataSource))
	return dataSourceAPI
}

func (dataSourceApi DataSourceApi) findAllByWorkspace(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	dataSources, dbErr := dataSourceApi.dataSourceMain.FindAllByWorkspace(r.Header.Get("workspaceId"))
	if dbErr != nil {
		log.Print(dbErr)
		api.NewRestError(w, http.StatusInternalServerError, errors.New("Error doing the process"))
		return
	}

	/* dataSourcesRepresentation, parseErr := parse(dataSources)

	if parseErr != nil {
		log.Print(parseErr)
		api.NewRestError(w, http.StatusInternalServerError, errors.New("Error doing the process"))
		return
	}
	*/
	api.NewRestSuccess(w, http.StatusOK, dataSources)
}

func (dataSourceApi DataSourceApi) deleteDataSource(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	err := dataSourceApi.dataSourceMain.Delete(ps.ByName("id"), r.Header.Get("workspaceId"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (dataSourceApi DataSourceApi) createDataSource(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	err := dataSourceApi.dataSourceMain.Delete(ps.ByName("id"))
	if err != nil {
		api.NewRestError(w, http.StatusInternalServerError, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

/* func parse(dataSources []DataSource) ([]dataSourceRepresentation, error) {
	var newDataSources []dataSourceRepresentation
	err := json.NewDecoder(dataSources).Decode(&newDataSources)
	if err != nil {
		return nil, err
	}

	return *newDataSources, nil
}
*/
