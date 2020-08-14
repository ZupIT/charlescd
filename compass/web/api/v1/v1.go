package v1

import (
	"compass/internal/datasource"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type UseCases interface {
	Start()
	NewPluginApi(pluginMain plugin.UseCases) PluginApi
	NewMetricsGroupApi(metricsGroupMain metricsgroup.UseCases) MetricsGroupApi
	NewDataSourceApi(dataSourceMain datasource.UseCases) DataSourceApi
}

type V1 struct {
	Router *httprouter.Router
	Path   string
}

const (
	v1Path = "/api/v1"
)

func NewV1() UseCases {
	router := httprouter.New()
	router.GET("/health", health)

	return V1{router, v1Path}
}

func (v1 V1) getCompletePath(path string) string {
	return fmt.Sprintf("%s%s", v1Path, path)
}

func health(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	w.Write([]byte(":)"))
}

func (v1 V1) Start() {
	fmt.Println("Server started on port 8080...")
	http.ListenAndServe(":8080", v1.Router)
}
