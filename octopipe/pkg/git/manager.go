package git

type ManagerUseCases interface {
	NewGit(gitProviderType string) (GitUseCases, error)
}

type GitManager struct{}

func NewGitManager() ManagerUseCases {
	return &GitManager{}
}
