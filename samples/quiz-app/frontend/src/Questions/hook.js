import { useState, useCallback } from 'react';
import { request } from '../api';

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('idle');

  const getQuestions = useCallback(async () => {
    try {
      setStatus('pending');
      const { data } = await request('/quiz-app-api/v1/questions');
      setStatus('resolved');
      setQuestions(data);
    } catch (e) {
      setStatus('rejected');
      console.error(e);
    }
  }, []);

  return {
    questions,
    status,
    getQuestions
  }
}