package health

import (
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"compass/pkg/logger"
	"encoding/json"
	"fmt"
)

type CircleHealthRepresentation struct {
	Requests CircleRequestsRepresentation   `json:"requests"`
	Latency  CircleHealthTypeRepresentation `json:"latency"`
	Errors   CircleHealthTypeRepresentation `json:"errors"`
}

type CircleRequestsRepresentation struct {
	Value float64 `json:"value"`
	Unit  string  `json:"unit"`
}

type CircleHealthTypeRepresentation struct {
	Unit             string                                `json:"unit"`
	CircleComponents []CircleComponentHealthRepresentation `json:"circleComponents"`
}

type CircleComponentHealthRepresentation struct {
	Name      string  `json:"name"`
	Threshold float64 `json:"threshold"`
	Value     float64 `json:"value"`
	Status    string  `json:"status"`
}

// TODO: Send lookup plugin method to plugin pkg
func (main Main) getResultQuery(workspaceId, query string) (float64, error) {

	fmt.Println("QUERY: ", query)

	datasource, err := main.datasource.FindHealthByWorkspaceId(workspaceId)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getResultQuery", err, "prometheus")
		return 0, err
	}

	plugin, err := main.pluginMain.GetPluginBySrc(datasource.PluginSrc)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getResultQuery", err, "prometheus")
		return 0, err
	}

	getQuery, err := plugin.Lookup("Result")
	if err != nil {
		logger.Error(util.PluginLookupError, "getResultQuery", err, plugin)
		return 0, err
	}

	return getQuery.(func(request datasourcePKG.ResultRequest) (float64, error))(datasourcePKG.ResultRequest{
		datasource.Data,
		query,
		[]datasourcePKG.MetricFilter{},
	})
}

func (main Main) getComponentStatus(thresholdValue, metricValue float64) string {
	if metricValue > thresholdValue {
		return "ERROR"
	} else if metricValue < thresholdValue && metricValue >= thresholdValue-(thresholdValue*0.1) {
		return "WARNING"
	}

	return "STABLE"
}

func (main Main) getComponentsErrorPercentage(workspaceId, circleId string) ([]CircleComponentHealthRepresentation, error) {
	body, err := main.mooveMain.GetMooveComponents(circleId, workspaceId)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getComponentsErrorPercentage", err, nil)
		return nil, err
	}

	var components []DeploymentInCircle
	err = json.Unmarshal(body, &components)
	if err != nil {
		return nil, err
	}

	circleComponents := []CircleComponentHealthRepresentation{}
	for _, component := range components {
		query := main.GetAverageHttpErrorsPercentageStringQuery(workspaceId, circleId)
		value, err := main.getResultQuery(workspaceId, query)
		if err != nil {
			logger.Error(util.QueryGetPluginError, "getComponentsErrorPercentage", err, nil)
			return nil, err
		}

		circleComponents = append(circleComponents, CircleComponentHealthRepresentation{
			Name:      component.Name,
			Value:     value,
			Threshold: component.ErrorThreshold,
			Status:    main.getComponentStatus(component.ErrorThreshold, value),
		})
	}

	return circleComponents, nil
}

func (main Main) getComponentsLatency(workspaceId, circleId string) ([]CircleComponentHealthRepresentation, error) {
	body, err := main.mooveMain.GetMooveComponents(circleId, workspaceId)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getComponentsLatency", err, nil)
		return nil, err
	}

	var components []DeploymentInCircle
	err = json.Unmarshal(body, &components)
	if err != nil {
		return nil, err
	}

	circleComponents := []CircleComponentHealthRepresentation{}
	for _, component := range components {
		query := main.GetAverageHttpErrorsPercentageStringQuery(workspaceId, circleId)
		value, err := main.getResultQuery(workspaceId, query)
		if err != nil {
			logger.Error(util.QueryGetPluginError, "getComponentsLatency", err, nil)
			return nil, err
		}

		circleComponents = append(circleComponents, CircleComponentHealthRepresentation{
			Name:      component.Name,
			Value:     value,
			Threshold: component.LatencyThreshold,
			Status:    main.getComponentStatus(component.LatencyThreshold, value),
		})
	}

	return circleComponents, nil
}

func (main Main) ComponentsHealth(workspaceId, circleId string) (CircleHealthRepresentation, error) {
	requestTotalQueryString := main.getTotalRequestStringQuery(workspaceId, circleId, true)
	requestsTotal, err := main.getResultQuery(workspaceId, requestTotalQueryString)
	if err != nil {
		return CircleHealthRepresentation{}, err
	}

	componentsErrorPercentage, err := main.getComponentsErrorPercentage(workspaceId, circleId)
	if err != nil {
		return CircleHealthRepresentation{}, err
	}

	componentsErrorLatency, err := main.getComponentsLatency(workspaceId, circleId)
	if err != nil {
		return CircleHealthRepresentation{}, err
	}

	return CircleHealthRepresentation{
		Requests: CircleRequestsRepresentation{requestsTotal, REQUESTS_BY_CIRCLE},
		Errors:   CircleHealthTypeRepresentation{REQUESTS_ERRORS_BY_CIRCLE, componentsErrorPercentage},
		Latency:  CircleHealthTypeRepresentation{REQUESTS_LATENCY_BY_CIRCLE, componentsErrorLatency},
	}, nil
}
