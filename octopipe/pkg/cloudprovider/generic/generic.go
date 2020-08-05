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
	"encoding/base64"

	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
)

type GenericProvider struct {
	Host              string `json:"host"`
	CAData            string `json:"caData"`
	ClientCertificate string `json:"clientCertificate"`
	ClientKey         string `json:"clientKey"`
}

func NewGenericProvider(genericProvider GenericProvider) GenericProvider {
	return genericProvider
}

func (genericProvider GenericProvider) GetClient() (dynamic.Interface, error) {
	restConfig, err := genericProvider.getRestConfig()
	if err != nil {
		return nil, err
	}

	return dynamic.NewForConfig(&restConfig)
}

func (genericProvider GenericProvider) getRestConfig() (rest.Config, error) {
	caData, err := genericProvider.getCAData()
	if err != nil {
		return rest.Config{}, err
	}

	clientCertificate, err := genericProvider.getClientCertificate()
	if err != nil {
		return rest.Config{}, err
	}

	clientKey, err := genericProvider.getClientKey()
	if err != nil {
		return rest.Config{}, err
	}

	restConfig := rest.Config{
		Host: genericProvider.Host,
		TLSClientConfig: rest.TLSClientConfig{
			CertData: clientCertificate,
			KeyData:  clientKey,
			CAData:   caData,
		},
	}

	return restConfig, nil
}

func (genericProvider GenericProvider) getCAData() ([]byte, error) {
	return base64.StdEncoding.DecodeString(genericProvider.CAData)
}

func (genericProvider GenericProvider) getClientCertificate() ([]byte, error) {
	return base64.StdEncoding.DecodeString(genericProvider.ClientCertificate)
}

func (genericProvider GenericProvider) getClientKey() ([]byte, error) {
	return base64.StdEncoding.DecodeString(genericProvider.ClientKey)
}
