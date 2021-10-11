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
	"fmt"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"io/ioutil"
	"net/http"
	"os"
)

func (api APIClient) GetMooveComponents(circleIDHeader, circleID string, workspaceID uuid.UUID) ([]byte, errors.Error) {
	mooveURL := fmt.Sprintf("%s/v2/modules/components/by-circle/%s", api.URL, circleID)

	request, err := http.NewRequest(http.MethodGet, mooveURL, nil)
	if err != nil {
		return nil, errors.NewError("Get error", err.Error()).
			WithOperations("GetMooveComponents.NewRequest")
	}

	request.Header.Add("x-workspace-id", workspaceID.String())
	request.Header.Add("x-circle-id", circleIDHeader)
	request.Header.Add("Authorization", os.Getenv("MOOVE_AUTH"))

	response, err := api.httpClient.Do(request)
	if err != nil {
		return nil, errors.NewError("Get error", err.Error()).
			WithOperations("GetMooveComponents.Do")
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, errors.NewError("Get error", "Moove internal server error").
			WithOperations("GetMooveComponents.NewRequest")
	}

	resultBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, errors.NewError("Read response body error", err.Error()).
			WithOperations("GetMooveComponents.NewRequest")
	}
	return resultBody, nil
}
