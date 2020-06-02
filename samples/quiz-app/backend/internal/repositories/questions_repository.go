package repositories

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"quiz_app/internal/types"
)

func GetQuestions() ([]types.Question, error) {
	var data types.Questions
	jsonFile, err := os.Open("assets/v1/questions.json")
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
	return data.Questions, nil
}