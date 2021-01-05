package event

import "github.com/google/uuid"

type Response struct {
	Id    uuid.UUID `json:"id"`
	Event string    `json:"event"`
}
