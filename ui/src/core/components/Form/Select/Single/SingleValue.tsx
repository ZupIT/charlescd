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

import Icon from 'core/components/Icon';
import React, { useEffect, useRef } from 'react';
import { SingleValueProps, OptionTypeBase } from 'react-select';
import Styled from './styled';

const SingleValue = ({
  children,
  ...props
}: SingleValueProps<OptionTypeBase>) => {
  const { options, clearValue } = props;
  const started = useRef(false);

  useEffect(() => {
    if (options && started.current) {
      clearValue();
    } else {
      started.current = true;
    }
  }, [options, clearValue]);

  return (
    <Styled.StyledSingleValue {...props}>
      {props.selectProps?.icon && <Icon name={props.selectProps.icon} />}
      {children}
    </Styled.StyledSingleValue>
  );

};

export default SingleValue;
