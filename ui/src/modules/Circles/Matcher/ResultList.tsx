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
import Styled from './styled';
import { CircleMatcherResult } from './interfaces';
import Loader from './Loader';
import routes from 'core/constants/routes';
import { useHistory } from 'react-router-dom';
import { addParam, isParamExists } from 'core/utils/path';

interface Props {
  isLoading: boolean;
  circles: CircleMatcherResult[];
}

const ResultList = ({ isLoading, circles }: Props) => {
  const history = useHistory();

  const circleCard = (circle: CircleMatcherResult) => {
    const addCircleParam = (id: string) => {
      if (!isParamExists('circle', id)) {
        addParam('circle', routes.circlesComparation, history, id);
      }
    };

    return (
      <Styled.CardWrapper key={circle.id}>
        <Styled.CardLeftLine />
        <Styled.CardContent>
          <div>
            <Text.h5 color="light">{circle.name}</Text.h5>{' '}
          </div>
          <div>
            <Text.h5 color="dark">{circle.id}</Text.h5>
          </div>
          <div>
            <Styled.ButtonOutlineRounded
              name="circle-matcher"
              color="light"
              onClick={() => addCircleParam(circle.id)}
            >
              View
            </Styled.ButtonOutlineRounded>
          </div>
        </Styled.CardContent>
      </Styled.CardWrapper>
    );
  };

  return (
    <Styled.Layer>
      {(isLoading || circles) && (
        <Styled.ContentIcon icon="list">
          <Text.h2 color="light">Result:</Text.h2>
        </Styled.ContentIcon>
      )}
      <Styled.Content>
        {isLoading ? <Loader /> : map(circles, circleCard)}
      </Styled.Content>
    </Styled.Layer>
  );
};

export default ResultList;
