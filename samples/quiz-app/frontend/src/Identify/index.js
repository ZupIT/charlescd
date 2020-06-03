import React, { useState, useEffect } from 'react';
import { useIdentify } from './hook';

function Identify() {
  const [form, setForm] = useState({});
  const { getCircleID, status } = useIdentify();

  useEffect(() => {
    if (status === 'resolved' || status === 'rejected') {
      window.location.href = "/questions";
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
