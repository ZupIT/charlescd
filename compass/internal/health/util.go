package health

import (
	"compass/internal/configuration"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

const (
	REQUESTS_BY_CIRCLE         = "req/s"
	REQUESTS_ERRORS_BY_CIRCLE  = "%"
	REQUESTS_LATENCY_BY_CIRCLE = "ms"
)

type DeploymentInCircle struct {
	Id               string  `json:"id"`
	Name             string  `json:"name"`
	ErrorThreshold   float64 `json:"errorThreshold"`
	LatencyThreshold float64 `json:"latencyThreshold"`
	ModuleId         string  `json:"moduleId"`
	ModuleName       string  `json:"moduleName"`
}

func (main Main) getMooveComponents(circleId, workspaceId string) ([]DeploymentInCircle, error) {
	mooveUrl := fmt.Sprintf("%s/v2/modules/components/by-circle/%s", configuration.GetConfiguration("MOOVE_URL"), circleId)

	fmt.Println(mooveUrl)

	request, err := http.NewRequest(http.MethodGet, mooveUrl, nil)
	if err != nil {
		return nil, err
	}
	request.Header.Add("x-workspace-id", workspaceId)

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, errors.New("Internal server error")
	}

	var body []DeploymentInCircle
	err = json.NewDecoder(response.Body).Decode(&body)
	if err != nil {
		return nil, err
	}

	return body, nil
}
