package util

import (
	"encoding/json"
	"net/http"
)

func NewResponse(w http.ResponseWriter, status int, data interface{}) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
