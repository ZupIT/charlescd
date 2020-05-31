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
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
)

type GithubConfig struct {
}

func NewGithubConfig() *GithubConfig {
	return &GithubConfig{}
}

func (githubConfig *GithubConfig) GetDataFromDefaultFiles(name, token, url string) ([]string, error) {
	var responseMap map[string]interface{}
	client := &http.Client{}
	filesData := []string{}

	for _, fileName := range getDefaultFileNamesByName(name) {
		filePath := fmt.Sprintf("%s/%s/%s", url, name, fileName)

		request, err := http.NewRequest("GET", filePath, nil)
		if err != nil {
			return nil, err
		}
		request.Header.Add("Authorization", fmt.Sprintf("token %s", token))
		response, err := client.Do(request)
		if err != nil {
			return nil, err
		}

		err = json.NewDecoder(response.Body).Decode(&responseMap)
		if err != nil {
			return nil, err
		}

		content := fmt.Sprintf("%s", responseMap["content"])
		contentDecoded, err := base64.StdEncoding.DecodeString(content)
		if err != nil {
			return nil, err
		}

		filesData = append(filesData, string(contentDecoded))
	}

	return filesData, nil
}
