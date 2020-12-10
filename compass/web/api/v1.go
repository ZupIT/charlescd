package api

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/web/api/v1/datasource"

	"github.com/ZupIT/charlescd/compass/web/api/v1/action"

	"github.com/ZupIT/charlescd/compass/web/api/v1/metricsgroup"
)

// v1.Router.GET(v1.getCompletePath(apiPath), v1.HttpValidator(metricsGroupApi.list))
// 	v1.Router.POST(v1.getCompletePath(apiPath), v1.HttpValidator(metricsGroupApi.create))
// 	v1.Router.GET(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.show))
// 	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/query"), v1.HttpValidator(metricsGroupApi.query))
// 	v1.Router.GET(v1.getCompletePath(apiPath+"/:id/result"), v1.HttpValidator(metricsGroupApi.result))
// 	v1.Router.PUT(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.update))
// 	v1.Router.PATCH(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.updateName))
// 	v1.Router.DELETE(v1.getCompletePath(apiPath+"/:id"), v1.HttpValidator(metricsGroupApi.delete))
// 	v1.Router.GET(v1.getCompletePath("/resume"+apiPath), v1.HttpValidator(metricsGroupApi.resume))

func (api *Api) newV1Api() {
	api.router.PathPrefix("/v1")
	{
		path := "/actions"
		api.router.HandleFunc(path, action.List(api.actionMain)).Methods("GET")
		api.router.HandleFunc(path, action.Create(api.actionMain)).Methods("POST")
		api.router.HandleFunc(fmt.Sprintf("%s/{actionID}", path), action.Delete(api.actionMain)).Methods("DELETE")
	}
	{
		path := "/datasources"
		api.router.HandleFunc(path, datasource.FindAllByWorkspace(api.datasourceMain)).Methods("GET")
		api.router.HandleFunc(path, datasource.Create(api.datasourceMain)).Methods("POST")
		api.router.HandleFunc(fmt.Sprintf("%s/{datasourceID}", path), datasource.Delete(api.datasourceMain)).Methods("DELETE")
		api.router.HandleFunc(fmt.Sprintf("%s/{datasourceID}/metrics", path), datasource.GetMetrics(api.datasourceMain)).Methods("DELETE")
		api.router.HandleFunc(fmt.Sprintf("%s/{datasourceID}/test-connection", path), datasource.TestConnection(api.datasourceMain)).Methods("DELETE")

	}
	{
		path := "/metrics-groups"
		api.router.HandleFunc(path, metricsgroup.Create(api.metricsGroupMain)).Methods("POST")
		api.router.HandleFunc(path, metricsgroup.GetAll(api.metricsGroupMain)).Methods("GET")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.Show(api.metricsGroupMain)).Methods("GET", "PUT")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/query", path), metricsgroup.Query(api.metricsGroupMain)).Methods("GET")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricGroupID}/result", path), metricsgroup.Result(api.metricsGroupMain)).Methods("GET")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.Update(api.metricsGroupMain)).Methods("PUT")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.UpdateName(api.metricsGroupMain)).Methods("PATCH") // TODO: Discutir necessidade desse patch
		api.router.HandleFunc(fmt.Sprintf("%s/{metricGroupID}", path), metricsgroup.Delete(api.metricsGroupMain)).Methods("DELETE")
		api.router.HandleFunc(fmt.Sprintf("resume/%s", path), metricsgroup.Resume(api.metricsGroupMain)).Methods("GET")
	}
}
