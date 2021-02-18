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
	"crypto/tls"
	"encoding/json"
	"fmt"
	"octopipe/pkg/customerror"
	"os"
	"strconv"
	"strings"

	"gopkg.in/resty.v1"
)

type GithubRepository struct {
	Url   string `json:"url"`
	Token string `json:"token"`
}

func NewGithubRepository(url, token string) GithubRepository {
	return GithubRepository{url, token}
}

func (githubRepository GithubRepository) GetTemplateAndValueByName(name string) (string, string, error) {
	envSkipHttpsValidation := os.Getenv("SKIP_GIT_HTTPS_VALIDATION")
	var skipTLS bool
	var errParse error
	if envSkipHttpsValidation != "" {
		skipTLS, errParse = strconv.ParseBool(envSkipHttpsValidation)
		if errParse != nil {
			return "", "", customerror.New("Get chart by gitlab failed", errParse.Error(), map[string]string{
				"validOptions": "1, t, T, TRUE, true, True, 0, f, F, FALSE, false, False",
			}, "gitlab.GetTemplateAndValueByName.ParseBool")
		}
	}

	basePathSplit := strings.Split(githubRepository.Url, "?")
	var completePath string
	if len(basePathSplit) > 1 {
		basePath := basePathSplit[0]
		queryParams := basePathSplit[1]
		completePath = fmt.Sprintf("%s/%s?%s", basePath, name, queryParams)
	} else {
		completePath = fmt.Sprintf("%s/%s", githubRepository.Url, name)
	}

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: skipTLS})
	client.SetHeader("Authorization", fmt.Sprintf("token %s", githubRepository.Token))
	resp, err := client.R().Get(completePath)
	if err != nil {
		return "", "", customerror.New("Get chart by github failed", err.Error(), map[string]string{
			"path": completePath,
		}, "github.GetTemplateAndValueByName.RequestGet")
	}

	if resp.IsError() {
		return "", "", customerror.New("Get chart by github failed", string(resp.Body()), map[string]string{
			"path": completePath,
		}, "github.GetTemplateAndValueByName.respIsError")
	}

	var contentList []map[string]interface{}
	err = json.Unmarshal(resp.Body(), &contentList)
	if err != nil {
		return "", "", customerror.New("Get chart by github failed", err.Error(), nil, "github.GetTemplateAndValueByName.Unmarshal")
	}

	var template string
	var value string
	for _, content := range contentList {
		contentName, ok := content["name"].(string)
		if !ok {
			continue
		}

		downloadUrl, ok := content["download_url"].(string)
		if !ok {
			continue
		}

		if strings.Contains(contentName, ".tgz") {
			resp, err := client.R().Get(downloadUrl)
			if err != nil {
				return "", "", customerror.New("Get chart by github failed", err.Error(), nil, "github.GetTemplateAndValueByName.GetTGZ")
			}

			if resp.IsError() {
				return "", "", customerror.New("Get chart by github failed", string(resp.Body()), map[string]string{
					"path": downloadUrl,
				}, "github.GetTemplateAndValueByName.GetTGZIsError")
			}

			template = string(resp.Body())
		}

		if strings.Contains(contentName, fmt.Sprintf("%s.yaml", name)) || strings.Contains(contentName, "value.yaml") {
			resp, err := client.R().Get(downloadUrl)
			if err != nil {
				return "", "", customerror.New("Get chart by github failed", err.Error(), nil, "github.GetTemplateAndValueByName.GetValue")
			}

			if resp.IsError() {
				return "", "", customerror.New("Get chart by github failed", string(resp.Body()), map[string]string{
					"path": downloadUrl,
				}, "github.GetTemplateAndValueByName.GetValueIsError")
			}

			value = string(resp.Body())
		}
	}

	if template == "" || value == "" {
		return "", "", customerror.New("Get chart by github failed", "Not found template or value in repository", nil, "github.GetTemplateAndValueByName.VerifyTemplteAndValue")
	}

	return template, value, nil
}
