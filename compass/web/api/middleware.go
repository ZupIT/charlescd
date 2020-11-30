package api

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"strconv"

	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/sirupsen/logrus"
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
		ers := NewApiErrors()

		fmt.Println(r.RequestURI)

		if getWhiteList(r.RequestURI) == "" && workspaceID == "" {
			ers.ToApiErrors(
				strconv.Itoa(http.StatusForbidden),
				"https://docs.charlescd.io/v/v0.3.x-pt/primeiros-passos/definindo-workspace",
				errors.NewError("Invalid request", "WorkspaceId is required").WithOperations("ValidatorMiddleware"),
			)

			NewResponse(w, http.StatusForbidden, ers)
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
