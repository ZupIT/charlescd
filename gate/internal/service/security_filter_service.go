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
