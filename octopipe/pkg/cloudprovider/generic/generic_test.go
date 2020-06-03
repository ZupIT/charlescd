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

package generic

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetRestConfigSuccess(t *testing.T) {
	genericProvider := &GenericProvider{
		Host:              "http://host.com",
		CAData:            "Q0EgRGF0YQ==",
		ClientCertificate: "Q2VydCBEYXRh",
		ClientKey:         "S2V5IERhdGE=",
	}

	restConfig, _ := genericProvider.getRestConfig()

	assert.Equal(t, string(restConfig.CAData), "CA Data")
	assert.Equal(t, string(restConfig.CertData), "Cert Data")
	assert.Equal(t, string(restConfig.KeyData), "Key Data")
}

func TestGetRestConfigCADataError(t *testing.T) {
	genericProvider := &GenericProvider{
		Host:              "http://host.com",
		CAData:            "Q0EgRGF0YQ==00",
		ClientCertificate: "Q2VydCBEYXRh",
		ClientKey:         "S2V5IERhdGE=",
	}

	_, err := genericProvider.getRestConfig()

	assert.Contains(t, err.Error(), "illegal base64")
}

func TestGetRestConfigCertDataError(t *testing.T) {
	genericProvider := &GenericProvider{
		Host:              "http://host.com",
		CAData:            "Q0EgRGF0YQ==",
		ClientCertificate: "Q2VydCBEYXRh000",
		ClientKey:         "S2V5IERhdGE=",
	}

	_, err := genericProvider.getRestConfig()

	assert.Contains(t, err.Error(), "illegal base64")
}

func TestGetRestConfigKeyDataError(t *testing.T) {
	genericProvider := &GenericProvider{
		Host:              "http://host.com",
		CAData:            "Q0EgRGF0YQ==",
		ClientCertificate: "Q2VydCBEYXRh",
		ClientKey:         "S2V5IERhdGE=00",
	}

	_, err := genericProvider.getRestConfig()

	assert.Contains(t, err.Error(), "illegal base64")
}
