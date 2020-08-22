package api

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/julienschmidt/httprouter"
)

type BaseEntityRepresentation struct {
	ID uuid.UUID `json:"id"`
}

type RestError struct {
	Message string `json:"message"`
}

func NewRestError(w http.ResponseWriter, status int, errs []error) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)

	var restErrors []RestError
	for _, err := range errs {
		restErrors = append(restErrors, RestError{Message: err.Error()})
	}
	json.NewEncoder(w).Encode(restErrors)
}

func NewRestSuccess(w http.ResponseWriter, status int, response interface{}) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}

func HttpValidator(
	next func(w http.ResponseWriter, r *http.Request, ps httprouter.Params, workspaceId string),
) func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

		workspaceID := r.Header.Get("x-workspace-id")

		if workspaceID == "" {
			NewRestError(w, http.StatusInternalServerError, []error{errors.New("WorkspaceId is required")})
			return
		}
		next(w, r, ps, workspaceID)
	}
}
