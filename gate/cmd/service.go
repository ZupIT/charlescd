package main

import (
	"github.com/ZupIT/charlescd/gate/internal/service"
)

type serviceManager struct {
	authTokenService service.AuthTokenService
	securityFilter   service.SecurityFilterService
}

func prepareServices() (serviceManager, error) {
	authTokenService := service.NewAuthTokenService()
	securityFilter, err := service.NewSecurityFilterService()
	if err != nil {
		return serviceManager{}, err
	}

	return serviceManager{
		authTokenService: authTokenService,
		securityFilter:   securityFilter,
	}, nil
}
