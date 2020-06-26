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

package deployment

// TODO: Remove todo and useu pipeline pkg

import "octopipe/pkg/cloudprovider"

const (
	StatusRunning       = "RUNNING"
	StatusSucceeded     = "SUCCEEDED"
	StatusWebhookFailed = "WEBHOOK_FAILED"
	StatusFailed        = "FAILED"
)

type Version struct {
	Version    string `json:"version"`
	VersionURL string `json:"versionUrl"`
}

type GitAccount struct {
	Provider string `json:"provider"`
	Token    string `json:"token"`
}

type Deployment struct {
	Name           string                      `json:"appName"`
	Namespace      string                      `json:"appNamespace"`
	Versions       []*Version                  `json:"versions"`
	UnusedVersions []*Version                  `json:"unusedVersions"`
	Webhook        string                      `json:"webhookUrl"`
	HelmRepository string                      `json:"helmUrl"`
	GitAccount     GitAccount                  `json:"git"`
	K8s            cloudprovider.Cloudprovider `json:"k8s"`
	Istio          map[string]interface{}      `json:"istio"`
	CircleID       string                      `json:"circleId"`
       TypeCallback   string                      `json:"typeCallback"`
}
