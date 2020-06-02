import { useState, useCallback } from 'react';
import { request } from '../api';

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);

  const getQuestions = useCallback(async () => {
    try {
      const { data } = await request('/quiz-app-api/v1/questions');
      setQuestions(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    questions,
    getQuestions
  }
}