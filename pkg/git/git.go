package git

import (
	"errors"
)

const (
	typeGithubProvider = "GITHUB"
)

type Git interface {
	GetDataFromDefaultFiles(name, token, url string) ([]string, error)
}

func NewGit(gitProviderType string) (Git, error) {
	switch gitProviderType {
	case typeGithubProvider:
		return NewGithubConfig(), nil
	default:
		return nil, errors.New("Not found git provider")
	}
}
