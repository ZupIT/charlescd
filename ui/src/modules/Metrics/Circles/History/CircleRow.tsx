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
import CircleReleasesTable from './CircleReleasesTable';
import { CircleHistory } from '../interfaces';

type Props = {
  circle: CircleHistory;
};

const CircleRow = ({ circle }: Props) => {
  const [activeRow, setActiveRow] = useState(false);

  return (
    <Styled.CircleRow>
      <Styled.TableRow onClick={() => setActiveRow(!activeRow)}>
        <Styled.TableColumn>
          <Text.h5 color="light">
            <Styled.Dot active={circle.status === 'ACTIVE'} />
          </Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn width={2}>
          <Text.h5 color="light">{circle.name}</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="light">8-6-2020 15:48:37</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="light">2400</Text.h5>
        </Styled.TableColumn>
      </Styled.TableRow>
      {activeRow && (
        <Styled.ReleasesWrapper>
          <CircleReleasesTable circleId={circle.id} />
        </Styled.ReleasesWrapper>
      )}
    </Styled.CircleRow>
  );
};

export default CircleRow;
