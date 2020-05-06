package template

type ManagerUseCases interface {
	NewTemplate(templateType string) (TemplateUseCases, error)
}

type TemplateManager struct{}

func NewTemplateManager() ManagerUseCases {
	return &TemplateManager{}
}
