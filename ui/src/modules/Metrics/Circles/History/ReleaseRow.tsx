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
import { CircleRelease } from '../interfaces';
import ReleaseComponentsTable from './ReleaseComponentsTable';

type Props = {
  release: CircleRelease;
};

const CircleReleasesTable = ({ release }: Props) => {
  const [activeRow, setActiveRow] = useState(false);

  return (
    <Styled.ReleaseRow key={release.id}>
      <Styled.TableRow onClick={() => setActiveRow(!activeRow)}>
        <Styled.TableColumn>
          <Text.h5 color="light">{release.name}</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="light">{release.deployed}</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="light">{release.undeployed}</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="light">{release.lastEditor}</Text.h5>
        </Styled.TableColumn>
      </Styled.TableRow>
      {activeRow && (
        <Styled.ReleasesWrapper>
          <ReleaseComponentsTable components={release.components} />
        </Styled.ReleasesWrapper>
      )}
    </Styled.ReleaseRow>
  );
};

export default CircleReleasesTable;
