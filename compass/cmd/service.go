package main

import (
	"github.com/ZupIT/charlescd/compass/internal/moove"
)

type serviceManager struct {
	mooveService moove.UseCases
}

func prepareServices() (serviceManager, error) {
	mooveDB, err := connectMooveDatabase()
	if err != nil {
		return serviceManager{}, err
	}

	mooveService := moove.NewMain(mooveDB)

	return serviceManager{
		mooveService: mooveService,
	}, nil
}
