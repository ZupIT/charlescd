package git

import (
	"errors"
)

const (
	typeGithubProvider = "GITHUB"
)

type GitUseCases interface {
	GetDataFromDefaultFiles(name, token, url string) ([]string, error)
}

func (gitManager *GitManager) NewGit(gitProviderType string) (GitUseCases, error) {
	switch gitProviderType {
	case typeGithubProvider:
		return NewGithubConfig(), nil
	default:
		return nil, errors.New("Not found git provider")
	}
}
