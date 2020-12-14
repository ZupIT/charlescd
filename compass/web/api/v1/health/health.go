package health

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/ZupIT/charlescd/compass/internal/health"
	"github.com/ZupIT/charlescd/compass/web/api/util"
)

func Components(healthMain health.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		projectionType := r.URL.Query().Get("projectionType")
		metricType := r.URL.Query().Get("metricType")
		circleIDHeader := r.Header.Get("x-circle-id")
		circleId := mux.Vars(r)["circleID"]
		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}

		circles, err := healthMain.Components(circleIDHeader, circleId, projectionType, metricType, workspaceUUID)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, circles)
	}
}

func ComponentsHealth(healthMain health.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		circleIDHeader := r.Header.Get("x-circle-id")
		circleId := mux.Vars(r)["circleID"]
		workspaceID := r.Header.Get("x-workspace-id")
		workspaceUUID, parseErr := uuid.Parse(workspaceID)
		if parseErr != nil {
			util.NewResponse(w, http.StatusInternalServerError, parseErr)
		}

		circles, err := healthMain.ComponentsHealth(circleIDHeader, circleId, workspaceUUID)
		if err != nil {
			util.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util.NewResponse(w, http.StatusOK, circles)
	}
}
