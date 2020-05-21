package template

import "errors"

const (
	TypeHelmTemplate = "HELM"
)

type TemplateUseCases interface {
	GetManifests(templateContent, valueContent string, overrideValues map[string]string) (map[string]interface{}, error)
}

func (templateManager *TemplateManager) NewTemplate(templateType string) (TemplateUseCases, error) {
	switch templateType {
	case TypeHelmTemplate:
		return NewHelmTemplate(), nil
	default:
		return nil, errors.New("No template provider")
	}
}
