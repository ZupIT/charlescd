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

package service

import (
	"github.com/ZupIT/charlescd/gate/internal/configuration"
	"github.com/casbin/casbin/v2"
)

type SecurityFilterService interface {
	Authorize(permission string, path string, method string) (bool, error)
}

type securityFilterService struct {
	enforcer *casbin.Enforcer
}

func casbinEnforcer() (*casbin.Enforcer, error) {
	enforcer, err := casbin.NewEnforcer(configuration.Get("AUTH_CONF_PATH"), configuration.Get("POLICY_PATH"))
	if err != nil {
		return nil, err
	}

	return enforcer, nil
}

func NewSecurityFilterService() (SecurityFilterService, error) {
	enforcer, err := casbinEnforcer()
	if err != nil {
		return securityFilterService{}, err
	}
	return securityFilterService{
		enforcer: enforcer,
	}, nil
}

func (securityFilterService securityFilterService) Authorize(permission string, path string, method string) (bool, error) {
	return securityFilterService.enforcer.Enforce(permission, path, method)
}
