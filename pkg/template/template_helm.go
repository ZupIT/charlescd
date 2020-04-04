package template

type HelmTemplate struct {
}

func NewHelmTemplate() *HelmTemplate {
	return &HelmTemplate{}
}

func (helmTemplate *HelmTemplate) GetManifests() map[string]interface{} {
	return map[string]interface{}{}
}
