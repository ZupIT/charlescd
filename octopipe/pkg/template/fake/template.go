package fake

import (
	"octopipe/pkg/template"
)

type TemplateManagerFake struct{}

func NewDeployerManagerFake() template.ManagerUseCases {
	return &TemplateManagerFake{}
}

type TemplateFake struct{}

func (t TemplateManagerFake) NewTemplate(templateType string) (template.TemplateUseCases, error) {
	return &TemplateFake{}, nil
}

func (t TemplateFake) GetManifests(templateContent, valueContent string, overrideValues map[string]string) (map[string]interface{}, error) {
	list := map[string]interface{}{
		"service":    map[string]interface{}{},
		"deployment": map[string]interface{}{},
	}

	return list, nil
}
