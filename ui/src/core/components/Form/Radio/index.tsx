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
import { ChangeInputEvent } from 'core/interfaces/InputEvents';
import Text from 'core/components/Text';
import Styled from './styled';

export interface Props {
  name: string;
  value: string;
  label: string;
  onChange?: (event: ChangeInputEvent) => void;
}

const Radio = React.forwardRef(
  (
    { name, value, label, onChange, ...rest }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const radioRef = useRef<HTMLInputElement>(null);
    const id = `radio-${value}`;

    useImperativeHandle(ref, () => radioRef.current);

    return (
      <Styled.Radio>
        <Styled.Input
          id={id}
          data-testid={id}
          ref={radioRef}
          type="radio"
          name={name}
          value={value}
          onChange={onChange}
          {...rest}
        />
        <Styled.Label value={value} htmlFor={id}>
          <Text.h4 color="light">{label}</Text.h4>
        </Styled.Label>
        <Styled.Checkmark onClick={() => radioRef.current.click()} />
      </Styled.Radio>
    );
  }
);

export default Radio;
