package fake

import (
	"octopipe/pkg/git"
)

type GitManagerFake struct{}

func NewGitManagerFake() git.ManagerUseCases {
	return &GitManagerFake{}
}

type GitFake struct{}

func (g GitManagerFake) NewGit(gitProviderType string) (git.GitUseCases, error) {
	return &GitFake{}, nil
}

func (g GitFake) GetDataFromDefaultFiles(name, token, url string) ([]string, error) {
	contents := []string{
		"content-1",
	}

	return contents, nil
}
