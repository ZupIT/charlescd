package generic

import (
	"encoding/base64"

	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
)

type GenericProvider struct {
	Host   string `json:"host"`
	CAData string `json:"clientCertificate"`
}

func NewGenericProvider() *GenericProvider {
	return &GenericProvider{}
}

func (genericProvider *GenericProvider) GetClient() (dynamic.Interface, error) {
	restConfig, err := genericProvider.getRestConfig()
	if err != nil {
		return nil, err
	}

	return dynamic.NewForConfig(restConfig)
}

func (genericProvider *GenericProvider) getRestConfig() (*rest.Config, error) {
	encodedCertificate, err := genericProvider.getEncodedCertificate()
	if err != nil {
		return nil, err
	}

	restConfig := &rest.Config{
		Host: genericProvider.Host,
		TLSClientConfig: rest.TLSClientConfig{
			CAData: encodedCertificate,
		},
	}

	return restConfig, nil
}

func (genericProvider *GenericProvider) getEncodedCertificate() ([]byte, error) {
	return base64.StdEncoding.DecodeString(genericProvider.CAData)
}
