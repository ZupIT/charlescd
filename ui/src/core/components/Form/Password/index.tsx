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

import React, { Ref, useRef, useImperativeHandle, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ChangeInputEvent, InputEvents } from 'core/interfaces/InputEvents';
import {
  INPUT_TYPE_PASSWORD,
  INPUT_TYPE_TEXT,
  INPUT_ICON_VIEW,
  INPUT_ICON_NO_VIEW
} from './constants';
import Styled from './styled';

export interface Props extends InputEvents {
  id?: string;
  className?: string;
  resume?: boolean;
  type?: string;
  name?: string;
  label?: string;
  autoComplete?: string;
  defaultValue?: string;
  password?: boolean;
  onChange?: (event: ChangeInputEvent) => void;
  disabled?: boolean;
}

const FormPassword = React.forwardRef(
  (
    {
      name,
      label,
      className,
      type = 'password',
      disabled = false,
      autoComplete = 'off',
      ...rest
    }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isPassword = type === INPUT_TYPE_PASSWORD;
    const [isFocused, setIsFocused] = useState(!isEmpty(rest.defaultValue));
    const [isHidden, setHidden] = useState(isPassword);

    useImperativeHandle(ref, () => inputRef.current);

    const handleChange = (event: ChangeInputEvent) =>
      setIsFocused(!isEmpty(event.currentTarget.value));

    return (
      <Styled.Wrapper type={type} className={className}>
        <Styled.Input
          ref={inputRef}
          type={isHidden ? INPUT_TYPE_PASSWORD : INPUT_TYPE_TEXT}
          name={name}
          data-testid={`password-${type}-${name}`}
          autoComplete={autoComplete}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        {label && (
          <Styled.Label
            isFocused={isFocused}
            onClick={() => inputRef.current.focus()}
          >
            {label}
          </Styled.Label>
        )}
        <Styled.Icon
          name={isHidden ? INPUT_ICON_NO_VIEW : INPUT_ICON_VIEW}
          color="light"
          onClick={() => setHidden(!isHidden)}
        />
      </Styled.Wrapper>
    );
  }
);

export default FormPassword;
