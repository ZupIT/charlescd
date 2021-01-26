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

package api

import (
	"github.com/sirupsen/logrus"
	"hermes/pkg/errors"
	"hermes/web/restutil"
	"log"
	"net/http"
	"net/http/httptest"
	"strconv"
)

var whitelistPaths = []string{
	"/health",
}

func getWhiteList(path string) string {
	for _, p := range whitelistPaths {
		if p == path {
			return p
		}
	}

	return ""
}

func ValidatorMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-type", "application/json")
		workspaceID := r.Header.Get("x-workspace-id")
		ers := restutil.NewApiErrors()

		if getWhiteList(r.RequestURI) == "" && workspaceID == "" {
			ers.ToApiErrors(
				strconv.Itoa(http.StatusForbidden),
				"https://docs.charlescd.io/v/v0.3.x-pt/primeiros-passos/definindo-workspace",
				errors.NewError("Invalid request", "WorkspaceId is required").WithOperations("ValidatorMiddleware"),
			)

			restutil.NewResponse(w, http.StatusForbidden, ers)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		recorderWrite := httptest.NewRecorder()
		next.ServeHTTP(recorderWrite, r)

		for key := range recorderWrite.Header() {
			w.Header().Add(key, recorderWrite.Header().Get(key))
		}

		log.Println(recorderWrite.Code)

		if recorderWrite.Code < 200 || recorderWrite.Code > 210 {
			logrus.WithFields(logrus.Fields{
				"err": recorderWrite.Body.String(),
			}).Warnln()
		}

		w.WriteHeader(recorderWrite.Code)
		recorderWrite.Body.WriteTo(w)
	})
}
