package subscription

import (
	"encoding/json"
	"fmt"
	"hermes/pkg/errors"
	"hermes/util"
	"io"
	"time"
)

type Subscription struct {
	util.BaseModel
	Url       string     `json:"url"`
	ApiKey    []byte     `json:"apiKey" gorm:"type:bytea"`
	CreatedBy string     `json:"createdBy"`
	DeletedBy string     `json:"deletedBy"`
	DeletedAt *time.Time `json:"-"`
}

type Request struct {
	util.BaseModel
	Url       string     `json:"url"`
	ApiKey    []byte     `json:"apiKey" gorm:"type:bytea"`
	CreatedBy string     `json:"createdBy"`
	DeletedBy string     `json:"deletedBy"`
	DeletedAt *time.Time `json:"-"`
}

type Response struct {
	util.BaseModel
	Url       string     `json:"url"`
	ApiKey    []byte     `json:"apiKey" gorm:"type:bytea"`
	CreatedBy string     `json:"createdBy"`
	DeletedBy string     `json:"deletedBy"`
	DeletedAt *time.Time `json:"-"`
}

func (main Main) ParseSubscription(subscription io.ReadCloser) (Request, errors.Error) {
	var newSubscription *Request
	err := json.NewDecoder(subscription).Decode(&newSubscription)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Parse.ParseDecode")
	}
	return *newSubscription, nil
}


func(main Main) Save(subscription Request) (Response, errors.Error) {
	fmt.Println("DEU BOM")
	return Response{}, nil
}