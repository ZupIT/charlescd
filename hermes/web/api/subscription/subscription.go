package subscription

import (
	"errors"
	"hermes/internal/subscription"
	util2 "hermes/web/util"
	"net/http"
)

func Create(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := subscriptionMain.ParseSubscription(r.Body)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		author := r.Header.Get("x-author")
		if author == "" {
			util2.NewResponse(w, http.StatusInternalServerError, errors.New("author is required"))
			return
		}
		request.CreatedBy = author

		createdSubscription, err := subscriptionMain.Save(request)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusCreated, createdSubscription)
	}
}
