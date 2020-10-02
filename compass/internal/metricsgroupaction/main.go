package metricsgroupaction

import (
	"compass/internal/action"
	"compass/internal/plugin"
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateGroupAction(metricsGroupAction MetricsGroupAction, workspaceID string) []util.ErrorUtil
	ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupAction, error)
	FindGroupActionById(id string) (MetricsGroupAction, error)
	SaveGroupAction(metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error)
	ListGroupActionExecutionStatusByGroup(groupID string) ([]GroupActionExecutionByStatus, error)
	UpdateGroupAction(id string, metricsGroupAction MetricsGroupAction) (MetricsGroupAction, error)
	DeleteGroupAction(id string) error
	SetExecutionFailed(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	SetExecutionSuccess(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupAction) bool
	CreateNewExecution(groupActionID string) (ActionsExecutions, error)
	FindExecutionById(actionExecutionID string) (ActionsExecutions, error)
	ValidateJobConfiguration(configuration ActionsConfigurations) []util.ErrorUtil
}

type Main struct {
	db         *gorm.DB
	pluginRepo plugin.UseCases
	actionRepo action.UseCases
}

func NewMain(db *gorm.DB, pluginRepo plugin.UseCases, actionRepo action.UseCases) UseCases {
	return Main{db, pluginRepo, actionRepo}
}
