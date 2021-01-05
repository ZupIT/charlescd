package subscription

import (
	"errors"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
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

		if err := subscriptionMain.Validate(request); len(err.GetErrors()) > 0 {
			util2.NewResponse(w, http.StatusBadRequest, err)
			return
		}

		createdSubscription, err := subscriptionMain.Save(request)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusCreated, createdSubscription)
	}
}

func Update(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := subscriptionMain.ParseUpdate(r.Body)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			util2.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		request.SubscriptionId = subscriptionId

		createdSubscription, err := subscriptionMain.Update(request)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusOK, createdSubscription)
	}
}

func Delete(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			util2.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		author := r.Header.Get("x-author")
		if author == "" {
			util2.NewResponse(w, http.StatusInternalServerError, errors.New("author is required"))
			return
		}

		err := subscriptionMain.Delete(subscriptionId, author)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusOK, nil)
	}
}

func FindById(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			util2.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		result, err := subscriptionMain.FindById(subscriptionId)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusOK, result)
	}
}
