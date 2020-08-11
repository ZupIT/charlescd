/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package repository

import (
	"errors"
	"octopipe/pkg/repository/github"
	"octopipe/pkg/repository/gitlab"
)

const (
	GithubType = "GITHUB"
	GitlabType = "GITLAB"
)

type UseCases interface {
	GetTemplateAndValueByName(name string) (string, string, error)
}

type Repository struct {
	Type  string `json:"type"`
	Url   string `json:"url"`
	Token string `json:"token"`
}

func (main RepositoryMain) NewRepository(repository Repository) (UseCases, error) {
	var repositories = map[string]UseCases{
		"GITHUB": github.NewGithubRepository(repository.Url, repository.Token),
		"GITLAB": gitlab.NewGitlabRepository(repository.Url, repository.Token),
	}
	var err error
	if repositories[repository.Type] == nil {
		err = errors.New("Cannot create repository main (unsupported git type)")
	}
	return repositories[repository.Type], err
}
