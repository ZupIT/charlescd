package repositories

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

func GetAnswers() (map[string]interface{}, error) {
	var data map[string]interface{}
	jsonFile, err := os.Open("assets/v2/answers.json")
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	err = json.Unmarshal(byteValue, &data)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return data, nil
}