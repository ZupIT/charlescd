/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package answers

import (
	"fmt"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"quiz_app/internal/repositories"
	"quiz_app/internal/types"
)

var (
	correctAnswersMetric = promauto.NewCounter(prometheus.CounterOpts{
		Name: "quiz_correct_answers_total",
		Help: "Total of correct answers",
	})

	numberOfTrialsMetric = promauto.NewCounter(prometheus.CounterOpts{
		Name: "quiz_trials_total",
		Help: "Total quizzes answered",
	})

	correctAnswersPercentMetric = promauto.NewCounter(prometheus.CounterOpts{
		Name: "quiz_correct_answers_percent_total",
		Help: "Percentage of correct answers",
	})
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

	metrify(float64(correctAnswers), percentageScore)
	return &types.ConsolidatedScore{
		TotalAnswers:    totalAnswers,
		CorrectAnswers:  correctAnswers,
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

func metrify(correctAnswersNumber float64, correctAnswersPercent float64) {
	correctAnswersMetric.Add(correctAnswersNumber)
	correctAnswersPercentMetric.Add(correctAnswersPercent)
	numberOfTrialsMetric.Inc()
}
