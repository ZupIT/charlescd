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

package v1

import (
	"errors"
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/action"
	"github.com/ZupIT/charlescd/compass/internal/datasource"
	healthPKG "github.com/ZupIT/charlescd/compass/internal/health"
	"github.com/ZupIT/charlescd/compass/internal/metric"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroup"
	"github.com/ZupIT/charlescd/compass/internal/metricsgroupaction"
	"github.com/ZupIT/charlescd/compass/internal/moove"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"github.com/ZupIT/charlescd/compass/web/api"
	"github.com/casbin/casbin/v2"
	"github.com/dgrijalva/jwt-go"
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
	"github.com/google/uuid"
	"net/http"
	"strings"

	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/julienschmidt/httprouter"
)

type UseCases interface {
	Start()
	NewPluginApi(pluginMain plugin.UseCases) PluginApi
	NewMetricsGroupApi(metricsGroupMain metricsgroup.UseCases) MetricsGroupApi
	NewMetricApi(metricMain metric.UseCases, metricGroupMain metricsgroup.UseCases) MetricApi
	NewDataSourceApi(dataSourceMain datasource.UseCases) DataSourceApi
	NewCircleApi(circleMain metricsgroup.UseCases) CircleApi
	NewHealthApi(healthMain healthPKG.UseCases) HealthApi
	NewActionApi(actionMain action.UseCases) ActionApi
	NewMetricsGroupActionApi(actionMain metricsgroupaction.UseCases) MetricsGroupActionApi
}

type V1 struct {
	Router    *httprouter.Router
	Path      string
	Enforcer  *casbin.Enforcer
	MooveMain moove.UseCases
	Limiter   *limiter.Limiter
}

type AuthToken struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	jwt.StandardClaims
}

const (
	v1Path = "/api/v1"
)

func NewV1(mooveMain moove.UseCases, authEnforcer *casbin.Enforcer, limiter *limiter.Limiter) UseCases {
	router := httprouter.New()
	router.GET("/health", health)
	router.GET("/metrics", metricHandler)

	return V1{Router: router, Path: v1Path, Enforcer: authEnforcer, MooveMain: mooveMain, Limiter: limiter}
}

func metricHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	promhttp.Handler().ServeHTTP(w, r)
}

func (v1 V1) getCompletePath(path string) string {
	return fmt.Sprintf("%s%s", v1Path, path)
}

func health(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	w.Write([]byte(":)"))
}

func (v1 V1) Start() {
	logger.Info("Server Started", "Port:8080")
	logger.Fatal("", http.ListenAndServe(":8080", v1.Router))
}

func (v1 V1) HttpValidator(
	next func(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId uuid.UUID),
) func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		var err error
		var workspaceUUID uuid.UUID

		reqErr := tollbooth.LimitByRequest(v1.Limiter, w, r)
		if reqErr != nil {
			api.NewRestError(w, http.StatusTooManyRequests, []error{errors.New("take a break")})
			return
		}

		workspaceID := strings.TrimSpace(r.Header.Get("x-workspace-id"))
		if workspaceID == "" {
			api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("workspaceId is required")})
			return
		} else if workspaceUUID, err = uuid.Parse(workspaceID); err != nil {
			api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("invalid workspaceId")})
			return
		}

		authToken, err := extractToken(r.Header.Get("Authorization"))
		if err != nil {
			logger.Error("invalid_token", "httpValidator", err, nil)
			api.NewRestError(w, http.StatusUnauthorized, []error{errors.New("token expired")})
			return
		}

		allowed, err := v1.authorizeUser(r.Method, r.URL.Path, authToken.Email, workspaceUUID)
		if err != nil || !allowed {
			logger.Error("unauthorized", "httpValidator", err, allowed)
			api.NewRestError(w, http.StatusForbidden, []error{errors.New("access denied")})
			return
		}

		next(w, r, ps, workspaceUUID)
	}
}

func extractToken(authorization string) (AuthToken, error) {
	rToken := strings.TrimSpace(authorization)
	if rToken == "" {
		return AuthToken{}, errors.New("empty token")
	}

	splitToken := strings.Split(rToken, "Bearer ")

	token, err := jwt.ParseWithClaims(splitToken[1], &AuthToken{}, nil)
	if token == nil {
		return AuthToken{}, fmt.Errorf("error parsing token: %v", err)
	}

	return *token.Claims.(*AuthToken), nil
}

func (v1 V1) authorizeUser(method, url, email string, workspaceID uuid.UUID) (bool, error) {
	user, err := v1.MooveMain.FindUserByEmail(email)
	if err != nil || user == (moove.User{}) {
		return false, err
	} else if user.IsRoot {
		return true, nil
	}

	permissions, err := v1.MooveMain.GetUserPermissions(user.ID, workspaceID)
	if err != nil {
		return false, err
	}

	for _, permission := range permissions {
		allowed, err := v1.Enforcer.Enforce(permission, url, method)
		if err != nil {
			return false, err
		} else if allowed {
			return true, nil
		}
	}

	return false, nil
}
