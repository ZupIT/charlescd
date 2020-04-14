import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'react-hook-form';
import { render } from 'unit-test/testUtils';
import FormSelect from '../index';

test('render react hook select', () => {
  const { result } = renderHook(() => useForm());
  const { control } = result.current;

  const { getByTestId } = render(
    <FormSelect name="fieldSelect" control={control} options={[]} />
  );

  expect(getByTestId('select-fieldSelect')).toBeInTheDocument();
});
