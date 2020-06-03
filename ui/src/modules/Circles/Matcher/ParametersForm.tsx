/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { useFieldArray, FieldValues, useFormContext } from 'react-hook-form';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import { blankParameter } from './constants';
import Styled from './styled';

interface Props {
  onSubmit: (data: FieldValues) => void;
}

const ParametersForm = ({ onSubmit }: Props) => {
  const minLength = 1;
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid }
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'parameters'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index: number) => (
        <Styled.InputWrapper key={field.id}>
          {fields.length > minLength && (
            <Styled.TrashIcon
              name="trash"
              size="15px"
              color="light"
              onClick={() => remove(index)}
            />
          )}
          <Styled.InputText
            label="Type a key"
            name={`parameters[${index}].key`}
            ref={register({ required: true })}
          />
          <Styled.InputText
            label="Type a value"
            name={`parameters[${index}].value`}
            ref={register({ required: true })}
          />
        </Styled.InputWrapper>
      ))}
      <Styled.Button
        size="EXTRA_SMALL"
        onClick={() => append(blankParameter)}
        isDisabled={!isValid}
      >
        <Icon name="add" size="15px" />
        Add parameter
      </Styled.Button>
      <Button.Default isDisabled={!isValid} type="submit">
        Send
      </Button.Default>
    </form>
  );
};

export default ParametersForm;
