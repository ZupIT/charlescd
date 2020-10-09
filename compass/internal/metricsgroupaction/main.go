package metricsgroupaction

import (
	"compass/internal/action"
	"compass/internal/plugin"
	"compass/internal/util"
	"github.com/jinzhu/gorm"
	"io"
)

type UseCases interface {
	ValidateGroupAction(metricsGroupAction MetricsGroupActions, workspaceID string) []util.ErrorUtil
	ParseGroupAction(metricsGroupAction io.ReadCloser) (MetricsGroupActions, error)
	FindGroupActionById(id string) (MetricsGroupActions, error)
	SaveGroupAction(metricsGroupAction MetricsGroupActions) (MetricsGroupActions, error)
	ListGroupActionExecutionResumeByGroup(groupID string) ([]GroupActionExecutionStatusResume, error)
	UpdateGroupAction(id string, metricsGroupAction MetricsGroupActions) (MetricsGroupActions, error)
	DeleteGroupAction(id string) error
	SetExecutionFailed(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	SetExecutionSuccess(actionExecutionID string, executionLog string) (ActionsExecutions, error)
	ValidateActionCanBeExecuted(metricsGroupAction MetricsGroupActions) bool
	CreateNewExecution(groupActionID string) (ActionsExecutions, error)
}

type Main struct {
	db         *gorm.DB
	pluginRepo plugin.UseCases
	actionRepo action.UseCases
}

func NewMain(db *gorm.DB, pluginRepo plugin.UseCases, actionRepo action.UseCases) UseCases {
	return Main{db, pluginRepo, actionRepo}
}
