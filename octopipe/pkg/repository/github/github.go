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

package github

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	log "github.com/sirupsen/logrus"
)

type GithubRepository struct {
	Url   string `json:"url"`
	Token string `json:"token"`
}

func NewGithubRepository(repository GithubRepository) GithubRepository {
	return repository
}

func (githubRepository GithubRepository) GetTemplateAndValueByName(name string) (string, string, error) {
	var responseMap map[string]interface{}
	client := &http.Client{}
	filesData := []string{}

	for _, fileName := range githubRepository.getDefaultFileNamesByName(name) {
		filePath := fmt.Sprintf("%s/%s/%s", githubRepository.Url, name, fileName)

		request, err := http.NewRequest("GET", filePath, nil)
		if err != nil {
			return "", "", err
		}

		request.Header.Add("Authorization", fmt.Sprintf("token %s", githubRepository.Token))
		log.WithFields(log.Fields{"function": "GetTemplateAndValueByName"}).Info("Request file from repository. Url: " + filePath)
		response, err := client.Do(request)
		if err != nil {
			return "", "", errors.New("Unable to request file for repository. Error: " + err.Error())
		}

		if response.StatusCode != 200 {
			return "", "", errors.New("Failed to find file in repository. StatusCode: " + strconv.Itoa(response.StatusCode))
		}

		err = json.NewDecoder(response.Body).Decode(&responseMap)
		if err != nil {
			return "", "", errors.New("It was not possible to decode the request body. Error: " + err.Error())
		}

		content := fmt.Sprintf("%s", responseMap["content"])
		contentDecoded, err := base64.StdEncoding.DecodeString(content)

		if err != nil {
			return "", "", errors.New("It was not possible to decode the body in base64 of the request. Error: " + err.Error())
		}

		filesData = append(filesData, string(contentDecoded))
	}

	return filesData[0], filesData[1], nil
}

func (githubRepository GithubRepository) getDefaultFileNamesByName(name string) []string {
	return []string{
		fmt.Sprintf("%s-darwin.tgz", name),
		fmt.Sprintf("%s.yaml", name),
	}
}
