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
