package errors

import (
	"github.com/google/uuid"
)

type ErrorLink map[string]string

type Error struct {
	ID     uuid.UUID `json:"id"`
	Links  ErrorLink `json:"links"`
	Status string    `json:"status"`
	Code   string    `json:"code"`
	Title  string    `json:"title"`
	Detail string    `json:"detail"`
	Field  string    `json:"field"`
}

type Errors struct {
	Errors     []Error `json:"errors"`
	Operations []string
}

func New(ers ...Error) *Errors {
	if len(ers) <= 0 {
		return &Errors{}
	}

	return &Errors{Errors: ers, Operations: []string{}}
}

func (errors *Errors) Append(err Error) *Errors {
	err.ID = uuid.New()
	errors.Errors = append(errors.Errors, err)
	return errors
}

func (errors *Errors) WithOperations(operation string) *Errors {
	errors.Operations = append(errors.Operations, operation)
	return errors
}
