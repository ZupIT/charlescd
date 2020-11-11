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
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/pkg/logger"
	"github.com/ZupIT/charlescd/compass/web/api"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"io/ioutil"
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
	Router  *httprouter.Router
	Path    string
	MooveDB *gorm.DB
}

type AuthToken struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	jwt.StandardClaims
}

const (
	v1Path = "/api/v1"
)

func NewV1(mooveDB *gorm.DB) UseCases {
	router := httprouter.New()
	router.GET("/health", health)
	router.GET("/metrics", metricHandler)

	return V1{Router: router, Path: v1Path, MooveDB: mooveDB}
}

func metricHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	promhttp.Handler().ServeHTTP(w, r)
}

func (v1 V1) getCompletePath(path string) string {
	return fmt.Sprintf("%s%s", v1Path, path)
}

func health(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	_, _ = w.Write([]byte(":)"))
}

func (v1 V1) Start() {
	logger.Info("Server Started", "Port:8080")
	logger.Fatal("", http.ListenAndServe(":8080", v1.Router))
}

func (v1 V1) HttpValidator(
	next func(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string),
) func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

		workspaceID := strings.TrimSpace(r.Header.Get("x-workspace-id"))
		if workspaceID == "" {
			api.NewRestError(w, http.StatusInternalServerError, []error{errors.New("workspaceId is required")})
			return
		}

		authToken := strings.TrimSpace(r.Header.Get("Authorization"))
		if authToken == "" {
			api.NewRestError(w, http.StatusUnauthorized, []error{errors.New("not authorized")})
			return
		}

		parsedToken, err := extractToken(authToken)
		if err != nil {
			api.NewRestError(w, http.StatusUnauthorized, []error{errors.New("token expired")})
			return
		}

		fmt.Println(parsedToken)

		next(w, r, ps, workspaceID)
	}
}

func extractToken(authorization string) (*AuthToken, error) {
	splitToken := strings.Split(authorization, "Bearer ")

	pkey, fileErr := ioutil.ReadFile(fmt.Sprintf("./pkey.txt"))
	if fileErr != nil {
		return nil, fileErr
	}

	key, keyErr := jwt.ParseRSAPublicKeyFromPEM(pkey)
	if keyErr != nil {
		return nil, fmt.Errorf("error parsing RSA public key: %v\n", keyErr)
	}

	token, err := jwt.ParseWithClaims(splitToken[1], &AuthToken{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return key, nil
	})
	if err != nil {
		return nil, fmt.Errorf("error parsing token: %v", err)
	}

	return token.Claims.(*AuthToken), nil
}

func (v1 V1) authorizeUser() {

}
