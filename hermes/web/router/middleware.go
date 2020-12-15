package router

import (
	"fmt"
	"hermes/pkg/errors"
	"hermes/web/util"
	"net/http"
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
		ers := NewApiErrors()

		fmt.Println(r.RequestURI)

		if getWhiteList(r.RequestURI) == "" && workspaceID == "" {
			ers.ToApiErrors(
				strconv.Itoa(http.StatusForbidden),
				"https://docs.charlescd.io/v/v0.3.x-pt/primeiros-passos/definindo-workspace",
				errors.NewError("Invalid request", "WorkspaceId is required").WithOperations("ValidatorMiddleware"),
			)

			util.NewResponse(w, http.StatusForbidden, ers)
			return
		}

		next.ServeHTTP(w, r)
	})
}

//func NewResponse(w http.ResponseWriter, status int, data interface{}) {
//	w.WriteHeader(status)
//	json.NewEncoder(w).Encode(data)
//}