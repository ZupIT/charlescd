package template

import "errors"

const (
	TypeHelmTemplate = "HELM"
)

type Template interface {
	GetManifests(templateContent, valueContent string, overrideValues map[string]string) (map[string]interface{}, error)
}

func NewTemplate(templateType string) (Template, error) {
	switch templateType {
	case TypeHelmTemplate:
		return NewHelmTemplate(), nil
	default:
		return nil, errors.New("No template provider")
	}
}
