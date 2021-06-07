package representation

import "github.com/ZupIT/charlescd/compass/internal/domain"

type InputParameters map[string]interface{}

type PluginResponse struct {
	Id              string          `json:"id"`
	Category        string          `json:"category"`
	Name            string          `json:"name"`
	Src             string          `json:"src"`
	Description     string          `json:"description"`
	InputParameters InputParameters `json:"inputParameters"`
}

func PluginToResponse(plugin domain.Plugin) PluginResponse {
	return PluginResponse{
		Id:              plugin.Id,
		Category:        plugin.Category,
		Name:            plugin.Name,
		Src:             plugin.Src,
		Description:     plugin.Description,
		InputParameters: InputParameters(plugin.InputParameters),
	}
}

func PluginToResponses(plugins []domain.Plugin) []PluginResponse {
	var pluginResponse []PluginResponse
	for _, plugin := range plugins {
		pluginResponse = append(pluginResponse, PluginToResponse(plugin))
	}
	return pluginResponse
}
