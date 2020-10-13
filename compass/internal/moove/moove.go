package moove

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
)

func (api APIClient) GetMooveComponents(circleId, workspaceId string) ([]byte, error) {
	mooveUrl := fmt.Sprintf("%s/v2/modules/components/by-circle/%s", api.URL, circleId)

	fmt.Println(mooveUrl)

	request, err := http.NewRequest(http.MethodGet, mooveUrl, nil)
	if err != nil {
		return nil, err
	}
	request.Header.Add("x-workspace-id", workspaceId)

	response, err := api.httpClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, errors.New("Internal server error")
	}

	resultBody, err := ioutil.ReadAll(response.Body)

	return resultBody, nil
}
