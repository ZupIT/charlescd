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

package gitlab

import (
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"

	log "github.com/sirupsen/logrus"
	"gopkg.in/resty.v1"
)

type GitlabRepository struct {
	Url   string `json:"url"`
	Token string `json:"token"`
}

func NewGitlabRepository(url, token string) GitlabRepository {
	return GitlabRepository{url, token}
}

func (gitlabRepository GitlabRepository) GetTemplateAndValueByName(name string) (string, string, error) {
	skipTLS, errParse := strconv.ParseBool(os.Getenv("SKIP_GIT_HTTPS_VALIDATION"))
	if errParse != nil {
		log.WithFields(log.Fields{"function": "GetTemplateAndValueByName"}).Info("SKIP_GIT_HTTPS_VALIDATION invalid, valid options (1, t, T, TRUE, true, True, 0, f, F, FALSE, false, False)")
	}

	basePathSplit := strings.Split(gitlabRepository.Url, "?")
	basePath := basePathSplit[0]
	queryParams, err := url.ParseQuery(basePathSplit[1])
	if err != nil {
		return "", "", err
	}

	if queryParams.Get("path") != "" {
		queryParams.Set("path", fmt.Sprintf("%s/%s", queryParams.Get("path"), name))
	} else {
		queryParams.Set("path", fmt.Sprintf("%s", name))
	}

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: skipTLS})
	client.SetHeader("PRIVATE-TOKEN", fmt.Sprintf("token %s", gitlabRepository.Token))

	resp, err := client.R().Get(fmt.Sprintf("%s/tree?%s", basePath, queryParams.Encode()))
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

		if strings.Contains(contentName, ".tgz") {
			resp, err := client.R().Get(fmt.Sprintf("%s/%s%%2F%s?%s", gitlabRepository.Url, name, contentName, queryParams.Encode()))
			if err != nil {
				return "", "", err
			}

			template = string(resp.Body())
		}

		if strings.Contains(contentName, fmt.Sprintf("%s.yaml", name)) || strings.Contains(contentName, "value.yaml") {
			resp, err := client.R().Get(fmt.Sprintf("%s/%s%%2F%s?%s", gitlabRepository.Url, name, contentName, queryParams.Encode()))
			if err != nil {
				return "", "", err
			}

			value = string(resp.Body())
		}
	}

	if template == "" || value == "" {
		return "", "", errors.New("not found template or value in gitlab repository")
	}

	return template, value, nil
}
