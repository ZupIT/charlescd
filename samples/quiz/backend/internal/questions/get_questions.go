package questions

import (
	"fmt"
	"quiz_app/internal/repositories"
	"quiz_app/internal/types"
)

func GetQuestions() ([]types.Question, error) {
	questions, err := repositories.GetQuestions()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return questions, nil
}