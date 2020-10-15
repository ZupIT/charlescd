/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
	"compass/internal/util"
	"compass/pkg/logger"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func (api APIClient) GetMooveComponents(circleIDHeader, circleId, workspaceId string) ([]byte, error) {
	mooveUrl := fmt.Sprintf("%s/v2/modules/components/by-circle/%s", api.URL, circleId)

	fmt.Println(mooveUrl)

	request, err := http.NewRequest(http.MethodGet, mooveUrl, nil)
	if err != nil {
		return nil, err
	}

	request.Header.Add("x-workspace-id", workspaceId)
	request.Header.Add("x-circle-id", circleIDHeader)
	request.Header.Add("Authorization", os.Getenv("MOOVE_AUTH"))

	response, err := api.httpClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		logger.Error(util.QueryGetPluginError, "GetMooveComponents", errors.New("Internal server error"), response)
		return nil, errors.New("Internal server error")
	}

	resultBody, err := ioutil.ReadAll(response.Body)

	return resultBody, nil
}
