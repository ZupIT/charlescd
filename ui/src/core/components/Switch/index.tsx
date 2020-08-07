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

import React, { useState } from 'react';
import Text from 'core/components/Text';
import Styled from './styled';

interface Props {
  label: string;
  active?: boolean;
  onChange?: (value: boolean) => void;
  name?: string;
}

const Switch = ({ label, active, onChange, name }: Props) => {
  const [isActive, setIsActive] = useState(active);

  const id = `switch-${name}`;

  const onSwitch = () => {
    setIsActive(!isActive);
    onChange && onChange(isActive);
  };

  return (
    <Styled.Switch>
      <Styled.Input
        data-testid={id}
        type="checkbox"
        checked={isActive}
        onChange={onSwitch}
      />
      <Styled.Toggle />
      <Text.h4 color="dark">{label}</Text.h4>
    </Styled.Switch>
  );
};

export default Switch;
