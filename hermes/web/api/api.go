package api

import "hermes/web/api/subscription"

func (api *Api) newV1Api() {
	api.router.PathPrefix("/v1")
	{
		path := "/subscription"
		//api.router.HandleFunc(path, subscription.Create(api.subscriptionMain)).Methods("POST")
		api.router.HandleFunc(path, subscription.Create(api.subscriptionMain)).Methods("GET")
	}
}
