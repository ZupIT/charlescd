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

import React, { KeyboardEvent, useImperativeHandle, useRef } from 'react';
import { isIntoMax, isNumber } from './helper';
import Styled from './styled';

interface Props {
  name: string;
  label?: string;
  max?: number;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
}

const Number = React.forwardRef(
  (
    {
      name,
      label,
      max,
      placeholder,
      className,
      defaultValue,
      maxLength,
      error,
      disabled = false
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current);

    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;
      const currentValue = event.currentTarget.value;
      const futureValue = `${currentValue}${key}`;

      if (!isNumber(key) || isIntoMax(futureValue, max)) {
        event.preventDefault();
      }
    }

    return (
      <Styled.Input
        name={name}
        label={label}
        type="number"
        ref={inputRef}
        className={className}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        defaultValue={defaultValue}
        maxLength={maxLength}
        disabled={disabled}
        error={error}
      />
    );
  }
);

export default Number;
