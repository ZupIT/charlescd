package middlewares

import (
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/casbin/casbin/v2"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
	"strings"
)

type AuthMiddleware struct {
	mooveService moove.UseCases
	enforcer     *casbin.Enforcer
}

type AuthToken struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	jwt.StandardClaims
}

func NewAuthMiddleware(mooveService moove.UseCases, enforcer *casbin.Enforcer) AuthMiddleware {
	return AuthMiddleware{
		mooveService: mooveService,
		enforcer:     enforcer,
	}
}

// Auth Could use the user that came from the JWT to Query the Database for the permissions and after
//do a check in a more complex way
func (a AuthMiddleware) Auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		var allowed bool

		openedToken, err := extractToken(echoCtx.Request().Header.Get("Authorization"))
		if err != nil {
			return echoCtx.JSON(http.StatusForbidden, logging.NewError("Token not informed or invalid", err, nil))
		}
		if logger, ok := logging.LoggerFromContext(echoCtx.Request().Context()); ok {
			logger.Infow(fmt.Sprintf("%v", openedToken))
		}

		user, err := a.mooveService.FindUserByEmail(openedToken.Email)
		if err != nil || user == (moove.User{}) {
			return echoCtx.JSON(http.StatusUnauthorized, logging.NewError("Not allowed", err, nil))
		} else if user.IsRoot {
			return next(echoCtx)
		}

		permissions, err := a.mooveService.GetUserPermissions(user.ID, uuid.MustParse(echoCtx.Request().Header.Get("x-workspace-id")))
		if err != nil {
			return echoCtx.JSON(http.StatusUnauthorized, logging.NewError("Not allowed", err, nil))
		}

		for _, permission := range permissions {
			allowed, enforcerErr := a.enforcer.Enforce(permission, echoCtx.Request().URL.Path, echoCtx.Request().Method)
			if enforcerErr != nil {
				return echoCtx.JSON(http.StatusForbidden, logging.NewError("Token not informed or invalid", err, nil))
			} else if allowed {
				return next(echoCtx)
			}
		}

		if !allowed {
			return echoCtx.JSON(http.StatusUnauthorized, logging.NewError("Not allowed", nil, nil))
		}

		return next(echoCtx)
	}
}

func extractToken(authorization string) (AuthToken, error) {
	rToken := strings.TrimSpace(authorization)
	if rToken == "" {
		return AuthToken{}, logging.NewError("Extract token error", errors.New("token is require"), nil)
	}

	splitToken := strings.Split(rToken, "Bearer ")

	token, _, err := new(jwt.Parser).ParseUnverified(splitToken[1], &AuthToken{})
	if err != nil {
		return AuthToken{}, logging.NewError("Extract token error", err, nil)
	}

	return *token.Claims.(*AuthToken), nil
}
