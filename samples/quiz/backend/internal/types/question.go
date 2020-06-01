package types

type Questions struct {
	Questions	[]Question `json:"questions"`
}

type Question struct {
	Id			string				`json:"id"`
	Title		string				`json:"title"`
	Answers		[]QuestionOption 	`json:"answers"`
}

type QuestionOption struct {
	Id			string	`json:"id"`
	Title		string	`json:"title"`
	IsCorrect	bool	`json:"isCorrect"`
}
