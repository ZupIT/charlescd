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
	"octopipe/pkg/customerror"

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

func (genericProvider GenericProvider) GetClient() (*rest.Config, error) {
	return genericProvider.getRestConfig()
}

func (genericProvider GenericProvider) getRestConfig() (*rest.Config, error) {
	caData, err := genericProvider.getCAData()
	if err != nil {
		return nil, customerror.WithOperation(err, "generic.getRestConfig.getCAData")
	}

	clientCertificate, err := genericProvider.getClientCertificate()
	if err != nil {
		return nil, customerror.WithOperation(err, "generic.getRestConfig.getClientCertificate")
	}

	clientKey, err := genericProvider.getClientKey()
	if err != nil {
		return nil, customerror.WithOperation(err, "generic.getRestConfig.getClientKey")
	}

	restConfig := &rest.Config{
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
	b, err := base64.StdEncoding.DecodeString(genericProvider.CAData)
	if err != nil {
		return nil, customerror.New("", err.Error(), nil, "generic.getCAData.DecodeString")
	}
	return b, nil
}

func (genericProvider GenericProvider) getClientCertificate() ([]byte, error) {
	b, err := base64.StdEncoding.DecodeString(genericProvider.ClientCertificate)
	if err != nil {
		return nil, customerror.New("", err.Error(), nil, "generic.getClientCertificate.DecodeString")
	}
	return b, nil
}

func (genericProvider GenericProvider) getClientKey() ([]byte, error) {
	b, err := base64.StdEncoding.DecodeString(genericProvider.ClientKey)
	if err != nil {
		return nil, customerror.New("", err.Error(), nil, "generic.getClientKey.DecodeString")
	}
	return b, nil
}
