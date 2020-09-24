package plugin

import (
	"plugin"
)

type UseCases interface {
	FindAll(category string) ([]Plugin, error)
	GetPluginBySrc(id string) (*plugin.Plugin, error)
}

type Main struct {
}

func NewMain() UseCases {
	return Main{}
}
