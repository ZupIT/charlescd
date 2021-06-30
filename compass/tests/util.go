package tests

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	datasourcePKG "github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
	"time"
)

func newBasicMetricsGroup() domain.MetricsGroup {
	return domain.MetricsGroup{
		Name:        "Name",
		Metrics:     nil,
		WorkspaceID: uuid.New(),
		CircleID:    uuid.New(),
		Actions:     nil,
	}
}


func newBasicDatasource() domain.Datasource {
	return domain.Datasource{
		Name:        "Name",
		PluginSrc:   "src.so",
		Data:        json.RawMessage(`{"someProperty": "someValue"}`),
		WorkspaceID: uuid.New(),
	}
}

func newBasicMetric() domain.Metric {
	return domain.Metric{
		Nickname:        "Nickname",
		Query:           "some query",
		Metric:          "some metric name",
		Filters:         []datasourcePKG.MetricFilter{},
		GroupBy:         []domain.MetricGroupBy{},
		Condition:       "=",
		Threshold:       5,
		CircleID:        uuid.New(),
		MetricExecution: domain.MetricExecution{},
	}
}

func newBasicAction() domain.Action {
	return domain.Action{
		WorkspaceId:   uuid.New(),
		Nickname:      "nickname",
		Type:          "validaction",
		Description:   "Some description",
		Configuration: json.RawMessage(`{"someProperty": "someValue"}`),
	}
}

func newBasicMetricsGroupAction() domain.MetricsGroupAction {
	return domain.MetricsGroupAction{
		Nickname:             "Nickname",
		ExecutionParameters:  json.RawMessage(`{"someProperty": "someValue"}`),
		ActionsConfiguration: domain.ActionsConfiguration{},
		DeletedAt:            nil,
	}
}

func newBasicActionExecution() domain.ActionsExecutions {
	now := time.Now()
	return domain.ActionsExecutions{
		Status:    "IN_EXECUTION",
		StartedAt: &now,
	}
}

func newListPlugins() []domain.Plugin {
		gInput := []interface{}{
			map[string]interface{}{
				"name":     "viewId",
				"label":    "View ID",
				"type":     "text",
				"required": true,
			},
			map[string]interface{}{
				"name":     "serviceAccount",
				"label":    "Service Account",
				"type":     "textarea",
				"required": true,
			},
		}

		pInput := []interface{}{
			map[string]interface{}{
				"name":     "url",
				"label":    "Url",
				"type":     "text",
				"required": true,
			},
		}

		return []domain.Plugin{
			{
				Id:          "datasourceerrorconnection",
				Category:    "datasource",
				Name:        "Fake Valid Datasource Error Connection",
				Src:         "datasource/errorconnection/errorconnection",
				Description: "Fake Valid Datasource Error Connection",
				InputParameters: map[string]interface{}{
					"configurationInputs": []interface{}{},
				},
			},
			{
				Id:          "googleanalytics",
				Category:    "datasource",
				Name:        "Google Analytics",
				Src:         "datasource/googleanalytics/googleanalytics",
				Description: "My google analytics",
				InputParameters: map[string]interface{}{
					"configurationInputs": gInput,
				},
			},
			{
				Id:          "prometheus",
				Category:    "datasource",
				Name:        "Prometheus",
				Src:         "datasource/prometheus/prometheus",
				Description: "My prometheus",
				InputParameters: map[string]interface{}{
					"configurationInputs": pInput,
				},
			},
			{
				Id:          "datasourcevalidaction",
				Category:    "datasource",
				Name:        "Fake Valid Datasource",
				Src:         "datasource/validaction/validaction",
				Description: "Fake Valid Datasource",
				InputParameters: map[string]interface{}{
					"configurationInputs": []interface{}{},
				},
			},
		}
	}
