/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"errors"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/dgrijalva/jwt-go"
	"strings"
)

type AuthTokenService interface {
	ParseAuthorizationToken(authorization string) (AuthToken, error)
}

type authTokenService struct{}

func NewAuthTokenService() AuthTokenService {
	return authTokenService{}
}

func (authTokenService authTokenService) ParseAuthorizationToken(authorization string) (AuthToken, error) {
	rToken := strings.TrimSpace(authorization)
	if rToken == "" {
		return AuthToken{}, logging.NewError("Extract token error", errors.New("token is required"), logging.InternalError, nil, "AuthTokenService.ParseAuthorizationToken")
	}

	splitToken := strings.Split(rToken, "Bearer ")

	token, _, err := new(jwt.Parser).ParseUnverified(splitToken[1], &AuthToken{})
	if err != nil {
		return AuthToken{}, logging.NewError("Extract token error", errors.New("token is required"), logging.InternalError, nil, "AuthTokenService.ParseAuthorizationToken")
	}

	return *token.Claims.(*AuthToken), nil
}
