package api

import (
	"fmt"

	"github.com/ZupIT/charlescd/compass/web/api/v1/plugin"

	"github.com/ZupIT/charlescd/compass/web/api/v1/metricsgroupaction"

	"github.com/ZupIT/charlescd/compass/web/api/v1/metric"

	"github.com/ZupIT/charlescd/compass/web/api/v1/health"

	"github.com/ZupIT/charlescd/compass/web/api/v1/circle"

	"github.com/ZupIT/charlescd/compass/web/api/v1/datasource"

	"github.com/ZupIT/charlescd/compass/web/api/v1/action"

	"github.com/ZupIT/charlescd/compass/web/api/v1/metricsgroup"
)

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
	{
		path := "/metrics-groups"
		api.router.HandleFunc(fmt.Sprintf("%s/{metricgroupID}/metrics", path), metric.Create(api.metricMain, api.metricsGroupMain)).Methods("GET")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricgroupID}/metrics/{metricID}", path), metric.Update(api.metricMain, api.metricsGroupMain)).Methods("PUT")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricgroupID}/metrics/{metricID}", path), metric.Delete(api.metricMain)).Methods("DELETE")
	}
	{
		path := "/group-actions"
		api.router.HandleFunc(path, metricsgroupaction.Create(api.metricGroupActionMain)).Methods("POST")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), metricsgroupaction.FindByID(api.metricGroupActionMain)).Methods("GET")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), metricsgroupaction.Update(api.metricGroupActionMain)).Methods("PUT")
		api.router.HandleFunc(fmt.Sprintf("%s/{metricgroupactionID}", path), metricsgroupaction.Delete(api.metricGroupActionMain)).Methods("DELETE")
	}
	{
		path := "/circles"
		api.router.HandleFunc(fmt.Sprintf("%s/{circleID}/metrics-groups", path), circle.ListMetricGroupInCircle(api.metricsGroupMain)).Methods("GET")
	}
	{
		path := "/application-health"
		api.router.HandleFunc(fmt.Sprintf("%s/{circleID}/components", path), health.Components(api.healthMain)).Methods("GET")
		api.router.HandleFunc(fmt.Sprintf("%s/{circleID}/components/health", path), health.ComponentsHealth(api.healthMain)).Methods("GET")
	}
	{
		path := "/plugins"
		api.router.HandleFunc(path, plugin.List(api.pluginMain)).Methods("GET")
	}
}
