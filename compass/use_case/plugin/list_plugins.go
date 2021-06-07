package plugin

import (
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
)

type ListPlugins interface {
	Execute(category string) ([]domain.Plugin, error)
}

type listPlugins struct {
	pluginRepository repository.PluginRepository
}

func NewListPlugins(d repository.PluginRepository) ListPlugins {
	return listPlugins{
		pluginRepository: d,
	}
}

func (s listPlugins) Execute(category string) ([]domain.Plugin, error) {
	plugins, err := s.pluginRepository.FindAll(category)
	if err != nil {
		return []domain.Plugin{}, logging.WithOperation(err, "listPlugins.Execute")
	}

	return plugins, nil
}
