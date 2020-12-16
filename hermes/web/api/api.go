package api

import (
	"github.com/gorilla/mux"
	"hermes/web/api/subscription"
)

func (api *Api) newV1Api(s *mux.Router) {
	r := s.PathPrefix("/v1").Subrouter()
	{
		path := "/subscription"
		r.HandleFunc(path, subscription.Create(api.subscriptionMain)).Methods("POST")
	}
}
