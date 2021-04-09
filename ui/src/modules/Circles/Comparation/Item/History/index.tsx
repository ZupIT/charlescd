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

import React, { useState, useEffect } from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';

interface Props {
  id: string;
  onGoBack: Function;
}

const DeployHistory = ({ onGoBack, id }: Props) => {
  return (
    <>
      <Styled.Layer data-testid="circles-deploy-history">
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Styled.Title>
          <Icon name="plus-circle" color="dark" size={'25px'} />
          <Text.h2 color="light">History</Text.h2>
        </Styled.Title>
      </Styled.Layer>
    </>
  );
};

export default DeployHistory;
