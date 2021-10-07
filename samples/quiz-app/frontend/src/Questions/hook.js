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

import { useState, useCallback } from 'react';
import { request } from '../api';

const questionsURL = process.env.REACT_APP_QUESTIONS_URL || '/quiz-app-api'

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('idle');

  const getQuestions = useCallback(async () => {
    try {
      setStatus('pending');
      const { data } = await request(`${questionsURL}/v1/questions`);
      setQuestions(data);
      setStatus('resolved');
    } catch (e) {
      setStatus('rejected');
      console.error(e);
    }
  }, []);

  return {
    questions,
    getQuestions,
    status
  }
}

export const useAnswer = () => {
  const [answer, setAnswer] = useState({});
  const [status, setStatus] = useState('idle');

  const getQuestionsResult = useCallback(async (payload) => {
    try {
      setStatus('pending');
      const { data } = await request(
        `${questionsURL}/v1/answers`,
        { method: 'POST', data: payload }
      );
      setStatus('resolved');
      setAnswer({
        ...data,
        percentageScore: data.percentageScore * 100
      });
    } catch (e) {
      setStatus('rejected');
      console.error(e);
    }
  }, [])

  return {
    answer,
    status,
    getQuestionsResult
  }
}