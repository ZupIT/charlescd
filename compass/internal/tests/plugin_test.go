/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package tests

import (
	"compass/internal/plugin"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuitePlugins struct {
	suite.Suite

	repository plugin.UseCases
}

func (s *SuitePlugins) SetupSuite() {
	os.Setenv("ENV", "TEST")
	s.repository = plugin.NewMain()
}

func TestInitPlugins(t *testing.T) {
	suite.Run(t, new(SuitePlugins))
}

func (s *SuitePlugins) TestFindAll() {
	gInput := []interface{}{
		map[string]interface{}{
			"name":     "viewId",
			"label":    "View ID",
			"type":     "text",
			"required": true,
		},
		map[string]interface{}{
			"name":     "serviceAccount",
			"label":    "Service Account",
			"type":     "textarea",
			"required": true,
		},
	}

	pInput := []interface{}{
		map[string]interface{}{
			"name":     "url",
			"label":    "Url",
			"type":     "text",
			"required": true,
		},
	}

	expectedPlugins := []plugin.Plugin{
		{
			ID:          "googleanalytics",
			Category:    "datasource",
			Name:        "Google Analytics",
			Src:         "datasource/googleanalytics/googleanalytics",
			Description: "My google analytics",
			InputParameters: map[string]interface{}{
				"configurationInputs": gInput,
			},
		},
		{
			ID:          "prometheus",
			Category:    "datasource",
			Name:        "Prometheus",
			Src:         "datasource/prometheus/prometheus",
			Description: "My prometheus",
			InputParameters: map[string]interface{}{
				"health":              true,
				"configurationInputs": pInput,
			},
		},
	}

	os.Setenv("PLUGINS_DIR", "../../dist")
	plugins, err := s.repository.FindAll("datasource")

	require.NoError(s.T(), err)
	for i, p := range plugins {
		require.Equal(s.T(), expectedPlugins[i], p)
	}
}

func (s *SuitePlugins) TestFindAllFull() {
	os.Setenv("PLUGINS_DIR", "../../dist")
	res, err := s.repository.FindAll("")

	require.NoError(s.T(), err)
	require.NotEmpty(s.T(), res)
}

func (s *SuitePlugins) TestFindAllNoSuchDirectory() {
	os.Setenv("PLUGINS_DIR", "./dist")

	_, err := s.repository.FindAll("")
	require.Error(s.T(), err)
}
