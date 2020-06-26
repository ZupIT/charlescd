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
import {
  components,
  OptionTypeBase,
  SingleValueProps,
  ValueContainerProps
} from 'react-select';
import Text from 'core/components/Text';
import { Option } from '../interfaces';
import { allOption } from './constants';

const { Placeholder } = components;

type ContainerProps = {
  children?: React.ReactNode[][];
} & ValueContainerProps<OptionTypeBase> &
  SingleValueProps<OptionTypeBase>;

const ValueContainer = ({ children, ...props }: ContainerProps) => {
  const currentValues = props.getValue() as Option[];
  let toBeRendered = children;

  if (currentValues.some((val: Option) => val.value === allOption.value)) {
    toBeRendered = [[children[0][0]], children[1]];
  } else if (currentValues.length) {
    const label = [
      <components.SingleValue {...props} key="selectedAmount">
        {currentValues.length} selected
      </components.SingleValue>
    ];
    toBeRendered = [label, children[1]];
  }

  return (
    <components.ValueContainer {...props}>
      <Placeholder {...props} innerProps={null}>
        {props.selectProps.placeholder}
      </Placeholder>
      <Text.h4 color="light">{toBeRendered}</Text.h4>
    </components.ValueContainer>
  );
};

export default ValueContainer;
