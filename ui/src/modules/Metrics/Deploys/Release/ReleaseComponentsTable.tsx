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
import Text from 'core/components/Text';
import Styled from './styled';
import { ReleaseHistoryComponents } from '..//interfaces';

type Props = {
  components: ReleaseHistoryComponents[];
};

const ReleaseComponentsTable = ({ components }: Props) => {
  return (
    <>
      <Styled.TableHead>
        <Styled.TableColumn width={1}>
          <Text.h5 color="dark">Modules</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn width={1}>
          <Text.h5 color="dark">Components</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn width={1}>
          <Text.h5 color="dark">Version</Text.h5>
        </Styled.TableColumn>
      </Styled.TableHead>
      {components.map((component, index) => (
        <Styled.ComponentsRow key={index}>
          <Styled.TableColumn width={1}>
            <Text.h5 color="light">{component.moduleName}</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn width={1}>
            <Text.h5 color="light">{component.name}</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn width={1}>
            <Text.h5 color="light">{component.version}</Text.h5>
          </Styled.TableColumn>
        </Styled.ComponentsRow>
      ))}
    </>
  );
};

export default ReleaseComponentsTable;
