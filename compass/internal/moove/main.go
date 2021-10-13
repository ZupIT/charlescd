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

package moove

import (
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type APIUseCases interface {
	GetMooveComponents(circleIDHeader, circleID string, workspaceID uuid.UUID) ([]byte, errors.Error)
}

type APIClient struct {
	URL        string
	httpClient *http.Client
}

func NewAPIClient(url string, timeout time.Duration) APIUseCases {
	return APIClient{
		URL: url,
		httpClient: &http.Client{
			Timeout: timeout,
		},
	}
}

type Main struct {
	Db *gorm.DB
}

type UseCases interface {
	FindUserByEmail(email string) (User, errors.Error)
	GetUserPermissions(userID, workspaceID uuid.UUID) ([]string, errors.Error)
}

func NewMain(mooveDb *gorm.DB) UseCases {
	return Main{Db: mooveDb}
}
