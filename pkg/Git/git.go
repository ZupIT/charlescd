package Git

import (
	"errors"
)

const (
	typeGithubProvider = "GITHUB"
)

type Git interface {
	GetContentData()
}

func NewGit(gitProviderType string) (Git, error) {
	switch gitProviderType {
	case typeGithubProvider:
		return NewGithubConfig(), nil
	default:
		return nil, errors.New("Not found git provider")
	}
}
