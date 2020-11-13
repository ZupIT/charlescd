package error

import "github.com/sirupsen/logrus"

type Operation string

type ErrorType string

const (
	NotFoundError     ErrorType = "NOT_FOUND"
	UnAuthorizedError ErrorType = "UNAUTHORIZED"
	Unexpected        ErrorType = "UNEXPECTED"
	NotValid          ErrorType = "NOT_VALID"
)

type Error struct {
	Fields     []string
	Operations []Operation
	ErrorType  ErrorType
	Errors     []error
	Severity   logrus.Level
}

func New(operation Operation, field string, errorType ErrorType, err error, severity logrus.Level) *Error {
	fields := []string{}
	errs := []error{}

	if field != "" {
		fields = append(fields, field)
	}

	if err != nil {
		errs = append(errs, err)
	}

	return &Error{
		Fields:     fields,
		Operations: []Operation{operation},
		ErrorType:  errorType,
		Errors:     errs,
		Severity:   severity,
	}
}

func (e *Error) WithOperation(operation Operation) *Error {
	e.Operations = append(e.Operations, operation)
	return e
}

func (e *Error) WithError(err error) *Error {
	e.Errors = append(e.Errors, err)
	return e
}

func (e *Error) WithField(field string) *Error {
	e.Fields = append(e.Fields, field)
	return e
}

func (e *Error) Merge(targetErr *Error) *Error {
	if targetErr == nil {
		return e
	}

	e.Fields = append(e.Fields, targetErr.Fields...)
	e.Errors = append(e.Errors, targetErr.Errors...)
	return e
}
