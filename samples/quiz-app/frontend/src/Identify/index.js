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
import { useIdentify } from './hook';

function Identify() {
  const [form, setForm] = useState({});
  const { getCircleID, status } = useIdentify();

  useEffect(() => {
    if (status === 'resolved' || status === 'rejected') {
      window.location.href = '/quiz-app/questions';
    }
  }, [status])

  const onSubmit = (event) => {
    event.preventDefault();
    getCircleID(form);
  }

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  }

  return (
    <div className="identify">
      <form onSubmit={onSubmit}>
        <label>
          What's your name?
          <input type="text" name="name" onChange={handleChange} />
        </label>
        <label>
          How old are you?
          <input type="text" name="age" onChange={handleChange} />
        </label>
        <label>
          What state do you reside in?
          <input type="text" name="state" onChange={handleChange} />
        </label>
        <label>
          What city do you reside in?
          <input type="text" name="city" onChange={handleChange} />
        </label>
        <label>
          What neighborhood do you reside in?
          <input type="text" name="neighborhood" onChange={handleChange} />
        </label>
        <button type="submit">
          { status === 'pending' ? '...' : 'Start'}
        </button>
      </form>
    </div>
  );
}

export default Identify;
