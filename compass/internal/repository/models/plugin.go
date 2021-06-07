package models

type Input struct {
	Name     string `json:"name"`
	Label    string `json:"label"`
	Type     string `json:"type"`
	Required bool   `json:"required"`
}

type InputParameters map[string]interface{}

type Plugin struct {
	ID              string          `json:"id"`
	Category        string          `json:"category"`
	Name            string          `json:"name"`
	Src             string          `json:"src"`
	Description     string          `json:"description"`
	InputParameters InputParameters `json:"inputParameters"`
}
