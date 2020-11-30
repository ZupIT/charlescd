package api

import (
	"github.com/ZupIT/charlescd/compass/web/api/v1/metricsgroup"
)

func (api *Api) newV1Api() {
	api.router.PathPrefix("/v1")
	{
		path := "/metrics-groups"
		api.router.HandleFunc(path, metricsgroup.Create(api.metricsGroupMain)).Methods("POST")
		api.router.HandleFunc(path, metricsgroup.GetAll(api.metricsGroupMain)).Methods("GET")
	}
	{

	}

}
