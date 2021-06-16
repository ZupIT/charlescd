package action

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/google/uuid"
)

type DeleteAction interface {
	Execute(id uuid.UUID) error
}

type deleteAction struct {
	actionRepository repository.ActionRepository
}

func NewDeleteAction(a repository.ActionRepository) DeleteAction {
	return deleteAction{
		actionRepository: a,
	}
}

func (s deleteAction) Execute(id uuid.UUID) error {
	err := s.actionRepository.DeleteAction(id)
	if err != nil {
		return logging.WithOperation(err, "createAction.Execute")
	}

	return nil
}
