import React, { useState, Suspense, useEffect } from 'react';
import { ReactComponent as Charles } from './svg/charles.svg';
import { useQuestions } from './Questions/hook';
import Identify from './Identify';

const Questions = React.lazy(() => import('./Questions'));

function App() {
  const [step, setStep] = useState('IDENTIFY');
  const { getQuestions, questions } = useQuestions();

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  const onIdentify = () => {
    setStep('QUESTIONS');
  }

  const onRestart = () => {
    window.location.reload();
  }

  return (
    <>
      <Charles className="logo" />
      { step === 'IDENTIFY' && (
        <Identify onIdentify={onIdentify} />
      )}
      {
        step === 'QUESTIONS' && (
          <Suspense fallback="">
            <Questions questions={questions} onRestart={onRestart} />
          </Suspense>
        )
      }
    </>
  );
}

export default App;
