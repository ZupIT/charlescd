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

func NewGenericProvider(genericProvider *GenericProvider) *GenericProvider {
	return genericProvider
}

func (genericProvider *GenericProvider) GetClient() (dynamic.Interface, error) {
	restConfig, err := genericProvider.getRestConfig()
	if err != nil {
		return nil, err
	}

	return dynamic.NewForConfig(restConfig)
}

func (genericProvider *GenericProvider) getRestConfig() (*rest.Config, error) {
	caData, err := genericProvider.getCAData()
	if err != nil {
		return nil, err
	}

	clientCertificate, err := genericProvider.getClientCertificate()
	if err != nil {
		return nil, err
	}

	clientKey, err := genericProvider.getClientKey()
	if err != nil {
		return nil, err
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

func (genericProvider *GenericProvider) getCAData() ([]byte, error) {
	return base64.StdEncoding.DecodeString(genericProvider.CAData)
}

func (genericProvider *GenericProvider) getClientCertificate() ([]byte, error) {
	return base64.StdEncoding.DecodeString(genericProvider.ClientCertificate)
}

func (genericProvider *GenericProvider) getClientKey() ([]byte, error) {
	return base64.StdEncoding.DecodeString(genericProvider.ClientKey)
}
