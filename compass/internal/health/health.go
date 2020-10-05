package health

import (
	"compass/internal/util"
	datasourcePKG "compass/pkg/datasource"
	"compass/pkg/logger"
	"fmt"
)

type CircleHealthRepresentation struct {
	requests CircleRequestsRepresentation
	latency  CircleHealthTypeRepresentation
	errors   CircleHealthTypeRepresentation
}

type CircleRequestsRepresentation struct {
	value float64
	unit  string
}

type CircleHealthTypeRepresentation struct {
	unit             string
	circleComponents []CircleComponentHealthRepresentation
}

type CircleComponentHealthRepresentation struct {
	Name      string
	Threshold float64
	Value     float64
	Status    string
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
	components, err := main.getMooveComponents(circleId)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getComponentsErrorPercentage", err, nil)
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
	components, err := main.getMooveComponents(circleId)
	if err != nil {
		logger.Error(util.QueryGetPluginError, "getComponentsLatency", err, nil)
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
		requests: CircleRequestsRepresentation{requestsTotal, REQUESTS_BY_CIRCLE},
		errors:   CircleHealthTypeRepresentation{REQUESTS_ERRORS_BY_CIRCLE, componentsErrorPercentage},
		latency:  CircleHealthTypeRepresentation{REQUESTS_LATENCY_BY_CIRCLE, componentsErrorLatency},
	}, nil
}
