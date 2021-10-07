/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import React, { useState, useEffect } from 'react';
import { ReactComponent as FinalIcon } from '../svg/final.svg';
import { ReactComponent as Loading } from '../svg/loading.svg';
import { useAnswer, useQuestions } from './hook';

function Questions() {
  const [questID, setQuestID] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [listSelecteds, setListSelecteds] = useState([]);
  const { getQuestionsResult, status, answer } = useAnswer();
  const { getQuestions, questions, status: questionsStatus } = useQuestions();

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  const nextQuestion = (question) => {
    const nextID = questID + 1;
    const list = [
      ...listSelecteds,
      {
        questionId: question.id,
        answerId: selectedAnswer
      }
    ];
    setQuestID(nextID);
    setListSelecteds(list);
    setSelectedAnswer();

    if (questions[nextID] === undefined) {
      getQuestionsResult(list);
    }
  }

  const getAnswerClass = (answerID) => {
    return answerID === selectedAnswer ? 'selected' : '';
  }

  const onRestart = () => window.location.href = '/quiz-app';

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer.id);
  }

  const renderFinish = () => (
    <>
      { status === 'pending' && <Loading /> }
      { status === 'resolved' && (
        <>
          <FinalIcon className="final" />
          <span className="result">You got {answer.percentageScore}% out of the questions right.</span>
          <button onClick={onRestart}>Restart</button>
        </>
      )}
      { status === 'rejected' && <button onClick={onRestart}>Restart</button>}
    </>
  )

  const renderQuestion = () => {
    const question = questions[questID];

    if (question) {
      const answers = question.answers || [] 
      return (
        <>
          <h2 className="question-text">{question.title}</h2>
          <ul className="answers">
          {answers.map((answer, index) => 
              <li 
                data-testid={`answer-${index}`}
                className={`answer ${getAnswerClass(answer.id)}`}
                key={answer.id}
                onClick={() => selectAnswer(answer)}>
                  {answer.title}
              </li>
            )}
          </ul>
          <button onClick={() => nextQuestion(question)} disabled={!selectedAnswer}>Next</button>
        </>
      )
    }

    return renderFinish();
  } 

  return (
    <>
      <section className="question">
        <h4 className="practice-text">Practice Quiz for Darwin and Natural Selection</h4>
        {console.log(questionsStatus)}
        {questionsStatus === 'pending' && <Loading />}
        {questionsStatus === 'resolved' && renderQuestion()}
        {questionsStatus === 'rejected' && renderFinish()}
      </section>
    </>
  );
}

export default Questions;