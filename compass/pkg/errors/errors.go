package errors

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

const (
	component = "compass"
)

type Error interface {
	WithMeta(key, value string) *AdvancedError
	WithOperations(operation string) *AdvancedError
	Error() SimpleError
	ErrorWithOperations() AdvancedError
}

type ErrorList interface {
	Append(ers ...Error) *CustomErrorList
	Get() *CustomErrorList
	GetErrors() []Error
}

type SimpleError struct {
	ID     uuid.UUID         `json:"id"`
	Title  string            `json:"title"`
	Detail string            `json:"detail"`
	Meta   map[string]string `json:"meta"`
}

type AdvancedError struct {
	*SimpleError
	Operations []string `json:"operations"`
}

func NewError(title string, detail string) Error {
	return &AdvancedError{
		SimpleError: &SimpleError{
			ID:     uuid.New(),
			Title:  title,
			Detail: detail,
			Meta: map[string]string{
				"component": component,
				"timestamp": time.Now().String(),
			},
		},
		Operations: []string{},
	}
}

func (err *AdvancedError) ErrorWithOperations() AdvancedError {
	return *err
}

func (err *AdvancedError) Error() SimpleError {
	return *err.SimpleError
}

func (err *AdvancedError) ToJSON() ([]byte, error) {
	return json.Marshal(err)
}

func (err *AdvancedError) WithMeta(key, value string) *AdvancedError {
	err.Meta[key] = value

	return err
}

func (err *AdvancedError) WithOperations(operation string) *AdvancedError {
	err.Operations = append(err.Operations, operation)
	return err
}

type CustomErrorList struct {
	Errors []Error `json:"errors"`
}

func NewErrorList() ErrorList {
	return &CustomErrorList{}
}

func (errList *CustomErrorList) Append(ers ...Error) *CustomErrorList {
	errList.Errors = append(errList.Errors, ers...)
	return errList
}

func (errList *CustomErrorList) Get() *CustomErrorList {
	return errList
}

func (errList *CustomErrorList) GetErrors() []Error {
	return errList.Errors
}
