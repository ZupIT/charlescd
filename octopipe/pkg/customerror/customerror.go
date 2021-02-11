package customerror

import (
	"time"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type customerror struct {
	ID         uuid.UUID
	Title      string
	Detail     string
	Operations []string
	Meta       map[string]string
}

func (err customerror) Error() string {
	return err.Detail
}

func WithLogFields(err error, operations ...string) logrus.Fields {
	customerr, ok := err.(customerror)
	if !ok {
		customerr = New("Internal error", err.Error(), nil, operations...)
	}
	return logrus.Fields{
		"id":         customerr.ID.String(),
		"title":      customerr.Title,
		"detail":     customerr.Detail,
		"operations": customerr.Operations,
		"meta":       customerr.Meta,
	}
}

func WithOperation(err error, operation string) error {
	customerr, ok := err.(*customerror)
	if !ok {
		return New("Internal error", err.Error(), nil, operation)
	}

	customerr.Operations = append(customerr.Operations, operation)
	return customerr
}

func WithMeta(err error, meta map[string]string, operations ...string) error {
	customerr, ok := err.(*customerror)
	if !ok {
		return New("Internal error", err.Error(), meta, operations...)
	}

	for k, v := range meta {
		customerr.Meta[k] = v
	}

	return customerr
}

func New(title string, detail string, meta map[string]string, operations ...string) customerror {
	var newMeta map[string]string
	if meta == nil {
		newMeta = map[string]string{
			"timestamp": time.Now().String(),
		}
	} else {
		meta["timestamp"] = time.Now().String()
	}

	return customerror{
		ID:         uuid.New(),
		Title:      title,
		Detail:     detail,
		Meta:       newMeta,
		Operations: operations,
	}
}
