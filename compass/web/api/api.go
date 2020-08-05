package api

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type RestError struct {
	Message string `json:"message"`
}

func NewRestError(w http.ResponseWriter, status int, err error) {
	w.Header().Add("Content/Type", "application/json")
	w.WriteHeader(status)
	restError := RestError{Message: err.Error()}
	res, _ := json.Marshal(restError)
	fmt.Fprint(w, string(res))
}

func NewRestSuccess(w http.ResponseWriter, status int, response interface{}) {
	w.Header().Add("Content/Type", "application/json")
	w.WriteHeader(status)
	res, _ := json.Marshal(response)
	fmt.Fprint(w, string(res))
}
