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

// func (s *SuitePlugins) TestFindAll() {
// 	gInput := []plugin.Input{
// 		{
// 			Name:     "viewId",
// 			Label:    "View ID",
// 			Type:     "text",
// 			Required: true,
// 		},
// 		{
// 			Name:     "serviceAccount",
// 			Label:    "Service Account",
// 			Type:     "textarea",
// 			Required: true,
// 		},
// 	}

// 	pInput := []plugin.Input{
// 		{
// 			Name:     "url",
// 			Label:    "Url",
// 			Type:     "text",
// 			Required: true,
// 		},
// 	}

// 	expectedPlugins := []plugin.Plugin{
// 		{
// 			ID:          "google_analytics",
// 			Category:    "datasource",
// 			Name:        "Google Analytics",
// 			Src:         "../../plugins/datasource/google_analytics/google_analytics",
// 			Description: "My google analytics",
// 		},
// 		{
// 			ID:          "prometheus",
// 			Category:    "datasource",
// 			Name:        "Prometheus",
// 			Src:         "../../plugins/datasource/prometheus/prometheus",
// 			Description: "My prometheus",
// 		},
// 	}

// 	os.Setenv("PLUGINS_DIR", "../../plugins")
// 	plugins, err := s.repository.FindAll("")

// 	require.NoError(s.T(), err)
// 	for i, p := range plugins {
// 		require.Equal(s.T(), expectedPlugins[i], p)
// 	}
// }

// func (s *SuitePlugins) TestFindAllNoSuchDirectory() {
// 	os.Setenv("PLUGINS_DIR", "./plugin")

// 	_, err := s.repository.FindAll("")
// 	require.Error(s.T(), err)
// }
