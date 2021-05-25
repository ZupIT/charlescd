package main

import (
	"github.com/casbin/casbin/v2"
	"github.com/labstack/echo/v4"
)

type server struct {
	pm       persistenceManager
	echo     *echo.Echo
	enforcer *casbin.Enforcer
}
