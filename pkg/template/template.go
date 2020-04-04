package template

import "errors"

const (
	TypeHelmTemplate = "HELM"
)

type Template interface {
	GetManifests() map[string]interface{}
}

func NewTemplate(helmType string) (Template, error) {
	switch helmType {
	case TypeHelmTemplate:
		return NewHelmTemplate(), nil
	default:
		return nil, errors.New("No template provider")
	}
}
