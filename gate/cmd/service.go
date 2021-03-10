package main

import (
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/gate/internal/service"
)

type serviceManager struct {
	authTokenService service.AuthTokenService
}

func prepareServices() (serviceManager, error) {
	authTokenService, err := service.NewAuthTokenService()
	if err != nil {
		return serviceManager{}, errors.New(fmt.Sprintf("Cannot instantiate auth token service with error: %s", err.Error()))
	}

	return serviceManager{
		authTokenService: authTokenService,
	}, nil
}