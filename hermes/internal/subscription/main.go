/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package subscription

import (
	"hermes/internal/notification/payloads"
	"hermes/pkg/errors"
	"io"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UseCases interface {
	ParseSubscription(subscription io.ReadCloser) (Request, errors.Error)
	ParseUpdate(subscription io.ReadCloser) (UpdateRequest, errors.Error)
	Validate(subscription Request) errors.ErrorList
	Save(subscription Request) (SaveResponse, errors.Error)
	Update(subscriptionID uuid.UUID, subscription UpdateRequest) (Response, errors.Error)
	Delete(subscriptionID uuid.UUID, author string) errors.Error
	FindByID(subscriptionID uuid.UUID) (Response, errors.Error)
	FindAllByExternalIDAndEvent(externalID uuid.UUID, event string) ([]ExternalIDResponse, errors.Error)
	FindAllByExternalID(externalID uuid.UUID) ([]Response, errors.Error)
	CountAllByExternalID(externalID uuid.UUID) (int64, errors.Error)
	SendWebhookEvent(msg payloads.MessageResponse) errors.Error
}
type Main struct {
	db *gorm.DB
}

func NewMain(db *gorm.DB) UseCases {
	return Main{db}
}
