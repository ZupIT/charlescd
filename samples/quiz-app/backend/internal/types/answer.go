package types

type UserAnswer struct {
	QuestionId	string	`json:"questionId"`
	AnswerId	string	`json:"answerId"`
}

type ConsolidatedScore struct {
	TotalAnswers 	int		`json:"totalAnswers"`
	CorrectAnswers	int		`json:"correctAnswers"`
	PercentageScore	float64	`json:"percentageScore"`
}

type Answer map[string]interface{}