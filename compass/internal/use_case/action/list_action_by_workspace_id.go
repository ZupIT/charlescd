package action

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type ListAction interface {
	Execute(workspaceId uuid.UUID) ([]domain.Action, error)
}

type listAction struct {
	actionRepository repository.ActionRepository
}

func NewListAction(a repository.ActionRepository) ListAction {
	return listAction{
		actionRepository: a,
	}
}

func (s listAction) Execute(workspaceId uuid.UUID) ([]domain.Action, error) {
	actions, err := s.actionRepository.FindAllActionsByWorkspace(workspaceId)
	if err != nil {
		return []domain.Action{}, logging.WithOperation(err, "createAction.Execute")
	}

	return actions, nil
}
