package main

import (
	"github.com/ZupIT/charlescd/gate/internal/service"
)

type serviceManager struct {
	authTokenService service.AuthTokenService
}

func prepareServices() (serviceManager, error) {
	authTokenService:= service.NewAuthTokenService()

	return serviceManager{
		authTokenService: authTokenService,
	}, nil
}