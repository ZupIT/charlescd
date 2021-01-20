package publisher

import (
	"encoding/json"
	"hermes/pkg/errors"
	"io"
)

func (main Main) ParseMessage(message io.ReadCloser) (Request, errors.Error) {
	var r *Request
	err := json.NewDecoder(message).Decode(&r)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Parse.ParseDecode")
	}
	return *r, nil
}

func (main Main) Validate(message Request) errors.ErrorList {
	return nil
}
//func (main Main) Publish(message Request, subscriptionIds []uuid.UUID) (SaveResponse, errors.Error) {
//
//	response, e, done := PublishMessage(message, subscriptionIds)
//	if done {
//		return response, e
//	}
//
//	return SaveResponse{}, nil
//}

//func PublishMessage(message Request, subscriptionIds []uuid.UUID) (SaveResponse, errors.Error, bool) {
//	conn := NewConnection("my-producer", "my-exchange", "queue-1")
//	if err := conn.Connect(); err != nil {
//		panic(err)
//	}
//	if err := conn.BindQueue(); err != nil {
//		panic(err)
//	}
//
//	var msgList []MessageRequest
//	for _, s := range subscriptionIds {
//		m := MessageRequest{
//			Request:        message,
//			SubscriptionId: s,
//		}
//		msgList = append(msgList, m)
//	}
//
//	byteM, err := util.GetBytes(msgList)
//	if err != nil {
//		return SaveResponse{}, errors.NewError("Parse error", err.Error()).
//			WithOperations("Parse.ParseDecode"), true
//	}
//	m := Message{
//		Queue:         conn.Queues,
//		ReplyTo:       "",
//		ContentType:   "text/plain",
//		CorrelationID: uuid.New().String(),
//		Priority:      0,
//		Body: MessageBody{
//			Data: byteM,
//			Type: "",
//		},
//	}
//	if err := conn.Publish(m); err != nil {
//		panic(err)
//	}
//	return SaveResponse{}, nil, false
//}
