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
import Input, { Props } from 'core/components/Form/Input';
import {
  INPUT_TYPE_PASSWORD,
  INPUT_TYPE_TEXT,
  INPUT_ICON_VIEW,
  INPUT_ICON_NO_VIEW
} from './constants';
import Styled from './styled';

const FormPassword = React.forwardRef(
  (
    { className, type = 'password', ...rest }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isPassword = type === INPUT_TYPE_PASSWORD;
    const [isHidden, setHidden] = useState(isPassword);

    useImperativeHandle(ref, () => inputRef.current);

    return (
      <Styled.Wrapper type={type} className={className}>
        <Input
          ref={inputRef}
          type={isHidden ? INPUT_TYPE_PASSWORD : INPUT_TYPE_TEXT}
          {...rest}
        />
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
