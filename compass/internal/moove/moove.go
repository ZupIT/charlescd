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
