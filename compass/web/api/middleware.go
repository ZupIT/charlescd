package api

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"

	"github.com/didip/tollbooth"

	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/dgrijalva/jwt-go"

	"github.com/google/uuid"

	"github.com/ZupIT/charlescd/compass/web/api/util"

	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/sirupsen/logrus"
)

var whitelistPaths = []string{
	"/health",
}

type AuthToken struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	jwt.StandardClaims
}

func getWhiteList(path string) string {
	for _, p := range whitelistPaths {
		if p == path {
			return p
		}
	}

	return ""
}

func (api Api) ValidatorMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-type", "application/json")
		workspaceID := r.Header.Get("x-workspace-id")

		ers := NewApiErrors()

		reqErr := tollbooth.LimitByRequest(api.limiter, w, r)
		if reqErr != nil {
			err := errors.NewError("Request error", reqErr.Error()).
				WithOperations("ValidatorMiddleware.LimitByRequest")
			util.NewResponse(w, http.StatusForbidden, err)
			return
		}

		if getWhiteList(r.RequestURI) == "" {
			if workspaceID == "" {
				ers.ToApiErrors(
					strconv.Itoa(http.StatusForbidden),
					"https://docs.charlescd.io/v/v0.3.x-pt/primeiros-passos/definindo-workspace",
					errors.NewError("Invalid request", "WorkspaceId is required").WithOperations("ValidatorMiddleware"),
				)

				util.NewResponse(w, http.StatusForbidden, ers)
				return
			} else {
				workspaceUUID := uuid.MustParse(workspaceID)

				authToken, err := extractToken(r.Header.Get("Authorization"))
				if err != nil {
					util.NewResponse(w, http.StatusUnauthorized, err)
					return
				}

				allowed, err := api.authorizeUser(r.Method, r.URL.Path, authToken.Email, workspaceUUID)
				if err != nil {
					util.NewResponse(w, http.StatusForbidden, err)
					return
				}

				if !allowed {
					util.NewResponse(w, http.StatusForbidden, errors.NewError("Forbidden", "Access denied"))
					return
				}

				next.ServeHTTP(w, r)
			}
		} else {
			next.ServeHTTP(w, r)
		}
	})
}

func extractToken(authorization string) (AuthToken, errors.Error) {
	rToken := strings.TrimSpace(authorization)
	if rToken == "" {
		return AuthToken{}, errors.NewError("Extract token error", "token is require").
			WithOperations("extractToken.tokenIsNil")
	}

	splitToken := strings.Split(rToken, "Bearer ")
	pkey, fileErr := ioutil.ReadFile(fmt.Sprintf("./pkey.txt"))
	if fileErr != nil {
		return AuthToken{}, errors.NewError("Extract token error", fileErr.Error()).
			WithOperations("extractToken.ReadFile")
	}

	key, keyErr := jwt.ParseRSAPublicKeyFromPEM(pkey)
	if keyErr != nil {
		return AuthToken{}, errors.NewError("Extract token error", fmt.Sprintf("Error parsing RSA public key: %s", keyErr.Error())).
			WithOperations("extractToken.ParseRSAPublicKeyFromPEM")
	}

	token, err := jwt.ParseWithClaims(splitToken[1], &AuthToken{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return key, nil
	})
	if err != nil {
		return AuthToken{}, errors.NewError("Extract token error", fmt.Sprintf("Error parsing token: %s", err.Error())).
			WithOperations("extractToken.ParseWithClaims")
	}

	return *token.Claims.(*AuthToken), nil
}

func (api Api) authorizeUser(method, url, email string, workspaceID uuid.UUID) (bool, errors.Error) {
	user, err := api.mooveMain.FindUserByEmail(email)
	if err != nil || user == (moove.User{}) {
		return false, err.WithOperations("authorizeUser.FindUserByEmail")
	} else if user.IsRoot {
		return true, nil
	}

	permissions, err := api.mooveMain.GetUserPermissions(user.ID, workspaceID)
	if err != nil {
		return false, err.WithOperations("authorizeUser.GetUserPermissions")
	}

	for _, permission := range permissions {
		allowed, enforcerErr := api.enforcer.Enforce(permission, url, method)
		if err != nil {
			return false, errors.NewError("Authorize error", enforcerErr.Error()).
				WithOperations("authorizeUser.Enforce")
		} else if allowed {
			return true, nil
		}
	}

	return false, nil
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		recorderWrite := httptest.NewRecorder()
		next.ServeHTTP(recorderWrite, r)

		for key := range recorderWrite.Header() {
			w.Header().Add(key, recorderWrite.Header().Get(key))
		}

		if recorderWrite.Code < 200 || recorderWrite.Code > 210 {
			logrus.Warn(recorderWrite.Body)
		}

		w.WriteHeader(recorderWrite.Code)
		recorderWrite.Body.WriteTo(w)
	})
}
