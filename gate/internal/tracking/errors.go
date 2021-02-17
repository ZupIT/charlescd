package tracking

import (
	"fmt"
	"github.com/google/uuid"
	"strconv"
	"time"
)

type CustomError struct {
	ID         uuid.UUID         `json:"id"`
	Title      string            `json:"title"`
	Detail     string            `json:"-"`
	Operations []string          `json:"-"`
	Meta       map[string]string `json:"meta"`
}

func (customError CustomError) Error() string {
	return fmt.Sprintf("%s", customError.Detail)
}

func WithOperation(err error, operation string) error {
	customErr := err.(*CustomError)
	customErr.Operations = append(customErr.Operations, operation)

	return customErr
}

func WithMeta(err error, key, value string) error {
	customErr := err.(*CustomError)
	customErr.Meta[key] = value

	return customErr
}

func Unwrap(err error) CustomError {
	customErr, ok := err.(*CustomError)
	if !ok {
		customErr = NewError("", err, nil).(*CustomError)
	}

	return *customErr
}

func NewError(title string, err error, meta map[string]string, operations ...string) error {
	if meta == nil {
		meta = map[string]string{
			"timestamp": strconv.FormatInt(time.Now().Unix(), 10),
		}
	} else {
		meta["timestamp"] = strconv.FormatInt(time.Now().Unix(), 10)
	}

	return &CustomError{
		ID:         uuid.New(),
		Title:      title,
		Meta:       meta,
		Detail:     err.Error(),
		Operations: operations,
	}
}