/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"log"
	"net/http"
	"net/http/httptest"

	"github.com/sirupsen/logrus"
)

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
		_, err := recorderWrite.Body.WriteTo(w)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			logrus.Error(err)
		}
	})
}
