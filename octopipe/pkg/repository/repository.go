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

	log "github.com/sirupsen/logrus"
)

const (
	GithubType = "GITHUB"
)

type UseCases interface {
	GetTemplateAndValueByName(name string) (string, string, error)
}

type Repository struct {
	Type string `json:"type"`
	github.GithubRepository
}

func (main RepositoryMain) NewRepository(repository Repository) (UseCases, error) {
	switch repository.Type {
	case GithubType:
		log.WithFields(log.Fields{"function": "NewRepository"}).Info("Selected github repository")
		return github.NewGithubRepository(repository.GithubRepository), nil
	default:
		log.WithFields(log.Fields{"function": "NewTemplate"}).Info("No valid repository")
		return nil, errors.New("Repository not found")
	}
}
