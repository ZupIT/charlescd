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

type authTokenService struct {}

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