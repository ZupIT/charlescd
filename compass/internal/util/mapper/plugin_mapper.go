package mapper

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
)

func PluginModelToDomain(plugin models.Plugin) domain.Plugin {
	return domain.Plugin{
		Id:              plugin.ID,
		Category:        plugin.Category,
		Name:            plugin.Name,
		Src:             plugin.Src,
		Description:     plugin.Description,
		InputParameters: domain.InputParameters(plugin.InputParameters),
	}

}

func PluginModelToDomains(plugin []models.Plugin) []domain.Plugin {
	plugins := make([]domain.Plugin, 0)
	for _, pl := range plugin {
		plugins = append(plugins, PluginModelToDomain(pl))
	}
	return plugins
}
