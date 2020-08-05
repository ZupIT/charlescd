package v1

import "net/http"

type UseCases interface {
	Start()
}

type V1 struct{}

const (
	v1Path = "/api/v1"
)

func NewV1() UseCases {
	http.HandleFunc("/health", health)

	return V1{}
}

func health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(":)"))
}

func (v1 V1) Start() {
	http.ListenAndServe(":8080", nil)
}
