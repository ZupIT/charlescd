import React, { useState, Suspense } from 'react';
import { ReactComponent as Charles } from './svg/charles.svg';
import Identify from './Identify';

const Questions = React.lazy(() => import('./Questions'));

function App() {
  const [step, setStep] = useState('IDENTIFY');

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
            <Questions onRestart={onRestart} />
          </Suspense>
        )
      }
    </>
  );
}

export default App;
