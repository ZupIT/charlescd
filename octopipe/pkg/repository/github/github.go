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
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"

	"gopkg.in/resty.v1"

	log "github.com/sirupsen/logrus"
)

type GithubRepository struct {
	Url   string `json:"url"`
	Token string `json:"token"`
}

func NewGithubRepository(url, token string) GithubRepository {
	return GithubRepository{url, token}
}

func (githubRepository GithubRepository) GetTemplateAndValueByName(name string) (string, string, error) {
	skipTLS, errParse := strconv.ParseBool(os.Getenv("SKIP_GIT_HTTPS_VALIDATION"))
	if errParse != nil {
		log.WithFields(log.Fields{"function": "GetTemplateAndValueByName"}).Info("SKIP_GIT_HTTPS_VALIDATION invalid, valid options (1, t, T, TRUE, true, True, 0, f, F, FALSE, false, False)")
	}

	basePathSplit := strings.Split(githubRepository.Url, "?")
	basePath := basePathSplit[0]
	queryParams := basePathSplit[1]

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: skipTLS})
	client.SetHeader("Authorization", fmt.Sprintf("token %s", githubRepository.Token))
	resp, err := client.R().Get(fmt.Sprintf("%s/%s?%s", basePath, name, queryParams))
	if err != nil {
		return "", "", err
	}

	var contentList []map[string]interface{}
	err = json.Unmarshal(resp.Body(), &contentList)
	if err != nil {
		return "", "", err
	}

	var template string
	var value string
	for _, content := range contentList {
		contentName, ok := content["name"].(string)
		if !ok {
			return "", "", errors.New("Not found name in content list api. ")
		}

		downloadUrl, ok := content["download_url"].(string)
		if !ok {
			return "", "", errors.New("Not found download_url in content list api.")
		}

		if strings.Contains(contentName, ".tgz") {
			resp, err := client.R().Get(downloadUrl)
			if err != nil {
				return "", "", err
			}

			template = string(resp.Body())
		}

		if strings.Contains(name, fmt.Sprintf("%s.yaml", contentName)) || strings.Contains(contentName, "value.yaml") {
			resp, err := client.R().Get(downloadUrl)
			if err != nil {
				return "", "", err
			}

			value = string(resp.Body())
		}
	}

	if template == "" || value == "" {
		return "", "", errors.New("not found template or value in git repository")
	}

	return template, value, nil
}
