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

import React, { Ref, useState } from 'react';
import {
  ChangeTextAreaEvent,
  TextAreaEvents
} from 'core/interfaces/TextAreaEvents';
import isEmpty from 'lodash/isEmpty';
import Styled from './styled';

export interface Props extends TextAreaEvents {
  id?: string;
  className?: string;
  resume?: boolean;
  name?: string;
  label?: string;
  autoComplete?: string;
  defaultValue?: string;
  onChange?: (event: ChangeTextAreaEvent) => void;
  disabled?: boolean;
}

const TextArea = React.forwardRef(
  (
    {
      name,
      label,
      onChange,
      className,
      disabled = false,
      autoComplete = 'off',
      ...rest
    }: Props,
    ref: Ref<HTMLTextAreaElement>
  ) => {
    const [isFocused, setIsFocused] = useState(!isEmpty(rest.defaultValue));

    const handleChange = (event: ChangeTextAreaEvent) => {
      setIsFocused(!isEmpty(event.currentTarget.value));

      if (onChange) {
        onChange(event);
      }
    };

    return (
      <Styled.Wrapper isFocused={isFocused} className={className}>
        <Styled.TextArea
          isFocused={isFocused}
          ref={ref}
          name={name}
          data-testid={`textarea-${name}`}
          autoComplete={autoComplete}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        {label && <Styled.Label isFocused={isFocused}>{label}</Styled.Label>}
      </Styled.Wrapper>
    );
  }
);

export default TextArea;
