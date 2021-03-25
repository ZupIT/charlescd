package authorization

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
)

type Input struct {
	Path   string
	Method string
}

func (input Input) InputToDomain() domain.Authorization {
	return domain.Authorization{
		Path:   input.Path,
		Method: input.Method,
	}
}
