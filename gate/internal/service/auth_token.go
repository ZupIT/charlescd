package service

import "github.com/dgrijalva/jwt-go"

type AuthToken struct {
	Name string
	Email string
	jwt.StandardClaims
}
