import React, { useState, useEffect } from 'react';
import { ReactComponent as CorrectIcon } from '../svg/correct.svg';
import { ReactComponent as IncorrectIcon } from '../svg/incorrect.svg';
import { ReactComponent as FinalIcon } from '../svg/final.svg';
import { ReactComponent as Loading } from '../svg/loading.svg';
import { useQuestions } from './hook';

function Questions() {
  const [questID, setQuestID] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [correctAnswer, setCorrectAnswer] = useState();
  const [countCorrect, setCountCorrect] = useState(0);
  const isCorrect = correctAnswer === selectedAnswer;
  const { getQuestions, questions, status } = useQuestions();

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  const nextQuestion = () => {
    const nextID = questID + 1;
    setQuestID(nextID);
    setCorrectAnswer();
    setSelectedAnswer();
  }

  const getAnswerClass = (answerID) => {
    if ((isCorrect && answerID === correctAnswer) || correctAnswer === answerID) {
      return 'correct';
    } else if (!isCorrect && answerID === selectedAnswer) {
      return 'incorrect';
    }

    return ''
  }

  const selectAnswer = (question, answer) => {
    const correctAnswer = question.answers.find(({ isCorrect }) => isCorrect) || {};

    if (correctAnswer.id === answer.id && countCorrect < questions.length) {
      const count = countCorrect + 1;
      setCountCorrect(count);
    }
 
    setSelectedAnswer(answer.id);
    setCorrectAnswer(correctAnswer.id);
  }

  const renderIcon = () => {
    if (!selectedAnswer) {
      return '';
    }

    return isCorrect ? <CorrectIcon /> : <IncorrectIcon />;
  }

  const onRestart = () => window.location.href = "/";

  const renderFinish = () => (
    <>
      <FinalIcon className="final" />
      <span className="result">You got {countCorrect} out of {questions.length}.</span>
      <button onClick={onRestart}>Restart</button>
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
                onClick={() => selectAnswer(question, answer)}>
                  {answer.title}
              </li>
            )}
          </ul>
          {renderIcon()}
          <button onClick={nextQuestion}>Next</button>
        </>
      )
    }

    return renderFinish();
  } 

  return (
    <>
      <section className="question">
        <h4 className="practice-text">Practice Quiz for Darwin and Natural Selection</h4>
        {status === 'pending' && <Loading />}
        {status === 'resolved' && renderQuestion()}
      </section>
    </>
  );
}

export default Questions;