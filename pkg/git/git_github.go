package git

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type GithubConfig struct {
}

func NewGithubConfig() *GithubConfig {
	return &GithubConfig{}
}

func (githubConfig *GithubConfig) GetDataFromDefaultFiles(name, token, url string) ([]string, error) {
	var responseMap map[string]interface{}
	client := &http.Client{}
	filesData := []string{}

	for _, fileName := range getDefaultFileNamesByName(name) {
		filePath := fmt.Sprintf("%s/%s/%s", url, name, fileName)

		log.Println(filePath)

		request, err := http.NewRequest("GET", filePath, nil)
		if err != nil {
			return nil, err
		}
		request.Header.Add("Authorization", fmt.Sprintf("token %s", token))
		response, err := client.Do(request)
		if err != nil {
			return nil, err
		}

		err = json.NewDecoder(response.Body).Decode(&responseMap)
		if err != nil {
			return nil, err
		}

		content := fmt.Sprintf("%s", responseMap["content"])
		contentDecoded, err := base64.StdEncoding.DecodeString(content)
		if err != nil {
			return nil, err
		}

		filesData = append(filesData, string(contentDecoded))
	}

	return filesData, nil
}
