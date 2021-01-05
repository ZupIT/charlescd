package event

import (
	"hermes/internal/event"
	util2 "hermes/web/util"
	"net/http"
)

func FindAll(eventMain event.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		result, err := eventMain.FindAll()
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusOK, result)
	}
}