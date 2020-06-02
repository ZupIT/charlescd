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

import React, { Ref, useRef, useImperativeHandle } from 'react';
import Text from 'core/components/Text';
import Styled from './styled';

interface Props {
  maxLength?: number;
  prepend?: string;
  append?: string;
  name?: string;
  isDisabled?: boolean;
  defaultValue: string;
}

const InputGroup = React.forwardRef(
  (
    {
      maxLength,
      name,
      prepend,
      append,
      defaultValue,
      isDisabled = true
    }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current);

    const renderPrepend = () => (
      <Styled.Prepend data-testid={`input-group-${defaultValue}-prepend`}>
        <Text.h5 color="light">{prepend}</Text.h5>
      </Styled.Prepend>
    );

    const renderAppend = () => (
      <Styled.Append data-testid={`input-group-${defaultValue}-append`}>
        <Text.h5 color="light">{append}</Text.h5>
      </Styled.Append>
    );

    return (
      <Styled.InputGroup data-testid={`input-group-${defaultValue}`}>
        {prepend && renderPrepend()}
        <Styled.Input
          disabled={isDisabled}
          type="text"
          maxLength={maxLength}
          ref={inputRef}
          name={name}
          defaultValue={defaultValue}
        />
        {append && renderAppend()}
      </Styled.InputGroup>
    );
  }
);

export default InputGroup;
