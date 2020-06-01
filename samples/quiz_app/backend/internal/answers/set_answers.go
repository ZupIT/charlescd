package answers

import (
	"fmt"
	"quiz_app/internal/repositories"
	"quiz_app/internal/types"
)

func SetAnswers(answers []types.UserAnswer) (*types.ConsolidatedScore, error) {
	totalAnswers, err := getQuestionsSize()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	correctAnswers, err := getCorrectAnswers(answers)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	percentageScore := float64(correctAnswers) / float64(totalAnswers)
	return &types.ConsolidatedScore{
		TotalAnswers: totalAnswers,
		CorrectAnswers: correctAnswers,
		PercentageScore: percentageScore,
	}, nil
}

func getQuestionsSize() (int, error) {
	questionsList, err := repositories.GetQuestions()
	if err != nil {
		fmt.Println(err)
		return -1, err
	}
	return len(questionsList), nil
}

func getCorrectAnswers(answers []types.UserAnswer) (int, error) {
	dbAnswers, err := repositories.GetAnswers()
	if err != nil {
		fmt.Println(err)
		return -1, err
	}

	var correctAnswers int = 0
	for i := 0; i < len(answers); i++ {
		if dbAnswers[answers[i].QuestionId] == answers[i].AnswerId {
			correctAnswers += 1
		}
	}
	return correctAnswers, nil
}