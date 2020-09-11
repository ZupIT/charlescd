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
import { useHistory } from 'react-router-dom';
import Text from 'core/components/Text';
import Styled from './styled';
import { getStatus } from '../../helpers';
import { CircleHistory } from '../interfaces';
import {
  humanizeDurationFromSeconds,
  dateTimeFormatter
} from 'core/utils/date';
import routes from 'core/constants/routes';
import { addParam } from 'core/utils/path';

type Props = {
  circle: CircleHistory;
};

const CircleRow = ({ circle }: Props) => {
  const history = useHistory();

  return (
    <Styled.CircleRow>
      <Styled.StatusLine status={getStatus(circle?.status)} />
      <Styled.TableRow
        data-testid={`circle-row-${circle.id}`}
        onClick={() =>
          addParam('circle', routes.circlesComparation, history, circle.id)
        }
      >
        <Styled.TableColumn>
          <Text.h5 color="light">{circle.name}</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="light">
            {dateTimeFormatter(circle.lastUpdatedAt)}
          </Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="light">
            {humanizeDurationFromSeconds(circle.lifeTime)}
          </Text.h5>
        </Styled.TableColumn>
      </Styled.TableRow>
    </Styled.CircleRow>
  );
};

export default CircleRow;
