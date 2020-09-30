package metricsgroupaction

import (
	"compass/internal/action"
	"compass/internal/metricsgroup"
	"compass/internal/plugin"
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateGroupAction(metricsGroupAction MetricsGroupAction) []util.ErrorUtil
	ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupAction, error)
	FindGroupActionById(id string) (MetricsGroupAction, error)
	FindAllGroupActions() ([]MetricsGroupAction, error)
	SaveGroupAction(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error)
	UpdateGroupAction(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error)
	DeleteGroupAction(id string) error
	SetExecutionFailed(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	SetExecutionSuccess(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupAction) bool
	CreateNewExecution(groupActionID string) (ActionsExecutions, error)
	FindExecutionById(actionExecutionID string) (ActionsExecutions, error)
	ValidateJobConfiguration(configuration ActionsConfigurations) []util.ErrorUtil
	SaveGroupActionConfiguration(configuration ActionsConfigurations) (ActionsConfigurations, error)
}

type Main struct {
	db              *gorm.DB
	pluginRepo      plugin.UseCases
	actionRepo      action.UseCases
	metricGroupRepo metricsgroup.UseCases
}

func NewMain(db *gorm.DB, pluginRepo plugin.UseCases, actionRepo action.UseCases, metricGroupRepo metricsgroup.UseCases) UseCases {
	return Main{db, pluginRepo, actionRepo, metricGroupRepo}
}
