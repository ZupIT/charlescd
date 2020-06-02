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

import React, { useImperativeHandle, useRef } from 'react';
import Styled from './styled';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

const Number = React.forwardRef(
  (
    { name, label, placeholder, className, defaultValue }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current);

    return (
      <Styled.Input
        name={name}
        label={label}
        type="number"
        ref={inputRef}
        className={className}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    );
  }
);

export default Number;
