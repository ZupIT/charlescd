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

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer.id);
  }

  const onRestart = () => window.location.href = "/";

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
            {answers.map(answer => 
              <li 
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
        {questionsStatus === 'pending' && <Loading />}
        {questionsStatus === 'resolved' && renderQuestion()}
      </section>
    </>
  );
}

export default Questions;