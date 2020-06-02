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
import reverse from 'lodash/reverse';
import getQueryStrings from 'core/utils/query';
import CirclesComparationItem from 'modules/Circles/Comparation/Item';
import Styled from './styled';
import CircleMatcher from '../Matcher';
import { CIRCLE_MATCHER_TAB } from '../constants';

interface Props {
  onChange: (delCircleStatus: string) => void;
}

const CirclesComparation = ({ onChange }: Props) => {
  const query = getQueryStrings();
  const circles = query.getAll('circle');

  const renderCircle = (id: string) => (
    <CirclesComparationItem
      id={id}
      onChange={(delCircleStatus: string) => onChange(delCircleStatus)}
    />
  );

  const renderCircleMatcher = () => <CircleMatcher />;

  const renderItems = () =>
    map(reverse(circles), id => (
      <div key={id}>
        {id === CIRCLE_MATCHER_TAB ? renderCircleMatcher() : renderCircle(id)}
      </div>
    ));

  return (
    <Styled.Wrapper data-testid="circles-comparation">
      {renderItems()}
    </Styled.Wrapper>
  );
};

export default CirclesComparation;
