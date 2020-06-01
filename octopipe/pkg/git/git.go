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
