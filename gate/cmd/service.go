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
	securityFilter := service.NewSecurityFilterService()

	return serviceManager{
		authTokenService: authTokenService,
		securityFilter:   securityFilter,
	}, nil
}
