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

import React, { Fragment, useState } from 'react';
import Styled from './styled';

interface Props {
  label: string;
  description?: string;
  active?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

const Checkbox = ({
  label,
  description,
  active,
  onChange,
  className
}: Props) => {
  const [isChecked, setIsChecked] = useState(active);

  const onCheck = () => {
    setIsChecked(!isChecked);
    onChange && onChange(isChecked);
  };

  return (
    <Fragment>
      <Styled.Checkbox data-testid={`checkbox-${label}`} className={className}>
        <Styled.Input
          data-testid={`checkbox-input-${label}`}
          type="checkbox"
          checked={isChecked}
          onChange={onCheck}
        />
        <Styled.Toggle data-testid={`checkbox-toggle-${label}`} />
        <Styled.Label color="light">{label}</Styled.Label>
      </Styled.Checkbox>

      {description && (
        <Styled.Description color="dark">{description}</Styled.Description>
      )}
    </Fragment>
  );
};

export default Checkbox;
