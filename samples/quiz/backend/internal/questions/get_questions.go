package questions

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type Questions struct {
	Questions	[]Question `json:"questions"`
}

type Question struct {
	Id			string		`json:"id"`
	Title		string		`json:"title"`
	Answers		[]Answer 	`json:"answers"`
}

type Answer struct {
	Id			string	`json:"id"`
	Title		string	`json:"title"`
	IsCorrect	bool	`json:"isCorrect"`
}

func GetQuestions() ([]Question, error) {
	var questions Questions

	jsonFile, err := os.Open("assets/v1/questions.json")
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	err = json.Unmarshal(byteValue, &questions)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return questions.Questions, nil
}