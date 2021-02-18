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
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"octopipe/pkg/customerror"
	"os"
	"strconv"
	"strings"

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

	basePathSplit := strings.Split(gitlabRepository.Url, "?")
	basePathRepositorySplit := strings.Split(basePathSplit[0], "/files")
	basePathRepository := basePathRepositorySplit[0]
	var pathQueries string
	if len(basePathSplit) > 1 {
		pathQueries = basePathSplit[1]
	}

	queryParams, err := url.ParseQuery(pathQueries)
	if err != nil {
		return "", "", customerror.New("Get chart by gitlab failed", err.Error(), map[string]string{
			"path": gitlabRepository.Url,
		}, "gitlab.GetTemplateAndValueByName.ParseQuery")
	}

	queryParams.Add("path", name)
	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: skipTLS})
	client.SetHeader("PRIVATE-TOKEN", fmt.Sprintf("%s", gitlabRepository.Token))

	resp, err := client.R().Get(fmt.Sprintf("%s/tree?%s", basePathRepository, queryParams.Encode()))
	if err != nil {
		return "", "", customerror.New("Get chart by gitlab failed", err.Error(), map[string]string{
			"path": fmt.Sprintf("%s/tree?%s", basePathRepository, queryParams.Encode()),
		}, "gitlab.GetTemplateAndValueByName.GetTree")
	}
	if resp.IsError() {
		return "", "", customerror.New("Get chart by gitlab failed", string(resp.Body()), map[string]string{
			"path": fmt.Sprintf("%s/tree?%s", basePathRepository, queryParams.Encode()),
		}, "gitlab.GetTemplateAndValueByName.GetTreeIsError")
	}

	var contentList []map[string]interface{}
	err = json.Unmarshal(resp.Body(), &contentList)
	if err != nil {
		return "", "", customerror.New("Get chart by gitlab failed", err.Error(), map[string]string{
			"body": string(resp.Body()),
		}, "gitlab.GetTemplateAndValueByName.Unmarshal")
	}

	var template string
	var value string
	for _, content := range contentList {
		contentName, ok := content["name"].(string)
		if !ok {
			continue
		}

		var path string
		if basePathRepositorySplit[1] == "" {
			path = url.PathEscape(fmt.Sprintf("%s/%s", name, contentName))
		} else {
			path = url.PathEscape(fmt.Sprintf("%s/%s/%s", basePathRepositorySplit[1], name, contentName))
		}
		if strings.Contains(contentName, ".tgz") {
			resp, err := client.R().Get(fmt.Sprintf("%s/files/%s?%s", basePathRepository, path, queryParams.Encode()))
			if err != nil {
				return "", "", customerror.New("Get chart by gitlab failed", err.Error(), map[string]string{
					"path": fmt.Sprintf("%s/files/%s?%s", basePathRepository, path, queryParams.Encode()),
				}, "gitlab.GetTemplateAndValueByName.GetChartTGZError")
			}

			if resp.IsError() {
				return "", "", customerror.New("Get chart by gitlab failed", string(resp.Body()), map[string]string{
					"path": fmt.Sprintf("%s/files/%s?%s", basePathRepository, path, queryParams.Encode()),
				}, "gitlab.GetTemplateAndValueByName.GetChartTGZFailed")
			}

			var contentFile map[string]interface{}
			err = json.Unmarshal(resp.Body(), &contentFile)
			if err != nil {
				return "", "", customerror.New("Get chart by gitlab failed", err.Error(), map[string]string{
					"body": string(resp.Body()),
				}, "gitlab.GetTemplateAndValueByName.UnmarshalChartTGZ")
			}

			content, ok := contentFile["content"].(string)
			if !ok {
				return "", "", nil
			}

			sDec, _ := base64.StdEncoding.DecodeString(content)

			template = string(sDec)
		}

		if strings.Contains(contentName, fmt.Sprintf("%s.yaml", name)) || strings.Contains(contentName, "value.yaml") {
			resp, err := client.R().Get(fmt.Sprintf("%s/files/%s?%s", basePathRepository, path, queryParams.Encode()))
			if err != nil {
				return "", "", customerror.New("Get chart by gitlab failed", err.Error(), map[string]string{
					"path": fmt.Sprintf("%s/files/%s?%s", basePathRepository, path, queryParams.Encode()),
				}, "gitlab.GetTemplateAndValueByName.GetChartValueError")
			}

			if resp.IsError() {
				return "", "", customerror.New("Get chart by gitlab failed", string(resp.Body()), map[string]string{
					"path": fmt.Sprintf("%s/files/%s?%s", basePathRepository, path, queryParams.Encode()),
				}, "gitlab.GetTemplateAndValueByName.GetChartValueFailed")
			}

			var contentFile map[string]interface{}
			err = json.Unmarshal(resp.Body(), &contentFile)
			if err != nil {
				return "", "", customerror.New("Get chart by gitlab failed", err.Error(), map[string]string{
					"body": string(resp.Body()),
				}, "gitlab.GetTemplateAndValueByName.UnmarshalChartValue")
			}

			content, ok := contentFile["content"].(string)
			if !ok {
				return "", "", nil
			}

			sDec, _ := base64.StdEncoding.DecodeString(content)

			value = string(sDec)
		}
	}

	if template == "" || value == "" {
		return "", "", errors.New("not found template or value in gitlab repository")
	}

	return template, value, nil
}
