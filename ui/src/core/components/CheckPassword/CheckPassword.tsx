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
import map from 'lodash/map';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { checkPoints } from './helpers';
import Styled from './styled';

interface Props {
  password: string;
  confirmPass: string;
  className?: string;
}

const CheckPassword = ({
  password,
  confirmPass,
  className,
  ...rest
}: Props) => {
  const renderCheckPoint = () => (
    <div {...rest} data-testid="check-password" className={className}>
      {map(checkPoints, checkPoint => {
        const isValid = checkPoint.rule(password, confirmPass);
        const icon = isValid ? 'checkmark' : 'close';
        const color = isValid ? 'success' : 'dark';

        return (
          <Styled.Item key={checkPoint.name}>
            <Icon name={icon} color={color} size="14px" />
            <Text.h5 color={color}>{checkPoint.name}</Text.h5>
          </Styled.Item>
        );
      })}
    </div>
  );

  return renderCheckPoint();
};

export default CheckPassword;
