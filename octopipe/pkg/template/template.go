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

package template

import (
	"errors"
	"octopipe/pkg/template/helm"

	log "github.com/sirupsen/logrus"
)

const (
	HelmType = "HELM"
)

type UseCases interface {
	GetManifests(templateContent, valueContent string) (map[string]interface{}, error)
}

type Template struct {
	Type string `json:"type"`
	helm.HelmTemplate
}

func (main TemplateMain) NewTemplate(template Template) (UseCases, error) {
	switch template.Type {
	case HelmType:
		log.WithFields(log.Fields{"function": "NewTemplate"}).Info("Selected helm template")
		return helm.NewHelmTemplate(template.HelmTemplate), nil
	default:
		log.WithFields(log.Fields{"function": "NewTemplate"}).Error("No template selected")
		return nil, errors.New("Template not found")
	}
}
