package metrics_group_action

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type CreateMetricGroupAction interface {
	Execute(metricsGroupAction domain.MetricsGroupAction, workspaceId uuid.UUID) (domain.MetricsGroupAction, error)
}

type createMetricsGroupAction struct {
	metricsGroupActionRepository repository.MetricsGroupActionRepository
	actionRepository             repository.ActionRepository
	pluginRepository             repository.PluginRepository
}

func NewCreateMetricsGroupAction(m repository.MetricsGroupActionRepository, a repository.ActionRepository, p repository.PluginRepository) CreateMetricGroupAction {
	return createMetricsGroupAction{
		metricsGroupActionRepository: m,
		actionRepository:             a,
		pluginRepository:             p,
	}
}

func (s createMetricsGroupAction) Execute(metricsGroupAction domain.MetricsGroupAction, workspaceId uuid.UUID) (domain.MetricsGroupAction, error) {

	act, err := s.actionRepository.FindActionByIdAndWorkspace(metricsGroupAction.ActionID, workspaceId)
	if err != nil || act.Type == "" {
		return domain.MetricsGroupAction{}, logging.WithOperation(err, "createMetricsGroupAction.Execute")
	}

	plugin, err := s.pluginRepository.GetPluginBySrc(fmt.Sprintf("action/%s/%s", act.Type, act.Type))
	if err != nil {
		return domain.MetricsGroupAction{}, logging.WithOperation(err, "createMetricsGroupAction.Execute")
	}

	pluginErrs, err := plugin.Lookup("ValidateExecutionConfiguration")
	if err != nil {
		return domain.MetricsGroupAction{}, logging.NewError("invalid data", err, map[string]string{"field": "type"}, "createAction.Execute.Lookup")
	}

	configErs := pluginErrs.(func(executionConfig []byte) []error)(metricsGroupAction.ExecutionParameters)
	if len(configErs) > 0 {
		for _, err := range configErs {
			return domain.MetricsGroupAction{}, logging.NewError("invalid data", err, map[string]string{"field": "type"}, "createAction.Execute.ValidateExecutionConfiguration")
		}
	}

	created, err := s.metricsGroupActionRepository.SaveGroupAction(metricsGroupAction)
	if err != nil {
		return domain.MetricsGroupAction{}, logging.WithOperation(err, "createMetricsGroupAction.Execute")
	}

	return created, nil
}
