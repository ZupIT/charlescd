package domain

type InputParameters map[string]interface{}

type Plugin struct {
	Id              string          `json:"id"`
	Category        string          `json:"category"`
	Name            string          `json:"name"`
	Src             string          `json:"src"`
	Description     string          `json:"description"`
	InputParameters InputParameters `json:"inputParameters"`
}
