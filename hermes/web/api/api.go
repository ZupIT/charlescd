package api

import (
	"fmt"
	"github.com/gorilla/mux"
	"hermes/web/api/subscription"
)

func (api *Api) newV1Api(s *mux.Router) {
	r := s.PathPrefix("/v1").Subrouter()
	{
		path := "/subscription"
		r.HandleFunc(path, subscription.Create(api.subscriptionMain)).Methods("POST")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}", path), subscription.Update(api.subscriptionMain)).Methods("PATCH")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}", path), subscription.Delete(api.subscriptionMain)).Methods("DELETE")
		r.HandleFunc(fmt.Sprintf("%s/{subscriptionId}", path), subscription.FindById(api.subscriptionMain)).Methods("GET")
	}
}
