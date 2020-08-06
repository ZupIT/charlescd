package api

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type RestError struct {
	Message string `json:"message"`
}

func NewRestError(w http.ResponseWriter, status int, err error) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	restError := RestError{Message: err.Error()}
	json.NewEncoder(w).Encode(restError)
}

func NewRestSuccess(w http.ResponseWriter, status int, response interface{}) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}

func HttpValidator(next func(w http.ResponseWriter, r *http.Request, ps httprouter.Params)) func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		worskapceID := r.Header.Get("workspaceId")

		if worskapceID == "" {
			NewRestError(w, http.StatusInternalServerError, errors.New("WorkspaceId is required"))
			return
		}
		next(w, r, ps)
	}
}
