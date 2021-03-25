package service

import "github.com/casbin/casbin/v2"

type SecurityFilterService interface {
	Enforce(permission string, path string, method string) (bool, error)
}

type securityFilterService struct {
	enforcer casbin.Enforcer
}

func NewSecurityFilterService() SecurityFilterService {
	return securityFilterService{}
}

func (securityFilterService securityFilterService) Enforce(permission string, path string, method string) (bool, error) {
	return securityFilterService.enforcer.Enforce(permission, path, method)
}
