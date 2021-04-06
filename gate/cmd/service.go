/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
