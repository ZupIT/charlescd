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
import Styled from './styled';
import { InputEvents } from 'core/interfaces/InputEvents';

export interface Props extends InputEvents {
  id?: string;
  className?: string;
  resume?: boolean;
  name?: string;
  disabled?: boolean;
}

const InputPhoto = React.forwardRef(
  (
    { name, className, disabled = false, ...rest }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current);

    return (
      <Styled.Wrapper className={className}>
        <Styled.InputPhoto
          ref={inputRef}
          name={name}
          data-testid={`input-photo-${name}`}
          disabled={disabled}
          {...rest}
        />
      </Styled.Wrapper>
    );
  }
);

export default InputPhoto;
