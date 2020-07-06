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
import CommonStyled from '../styled';
import ReleasesTable from './ReleasesTable';
import { History } from '../interfaces';
import Loader from '../../Loaders/index';

type Props = {
  data: History[];
  loading: boolean;
};

const HistoryComponent = ({ data, loading }: Props) => {
  const [activeRow, setActiveRow] = useState('');

  const expandRow = (id: string) => {
    if (id === activeRow) {
      setActiveRow('');
    } else {
      setActiveRow(id);
    }
  };

  return (
    <Styled.Table>
      <Styled.TableHead>
        <Styled.TableColumn>
          <Text.h5 color="dark">Status</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn width={2}>
          <Text.h5 color="dark">Circles</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="dark">Last update</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="dark">Life time</Text.h5>
        </Styled.TableColumn>
      </Styled.TableHead>
      {loading ? (
        <Loader.History />
      ) : (
        <>
          {data?.map(circle => (
            <Styled.CircleRow key={circle.id}>
              <Styled.TableRow onClick={() => expandRow(circle.id)}>
                <Styled.TableColumn>
                  <Text.h5 color="light">
                    <CommonStyled.Dot
                      active={circle.circleStatus === 'active'}
                    />
                  </Text.h5>
                </Styled.TableColumn>
                <Styled.TableColumn width={2}>
                  <Text.h5 color="light">{circle.name}</Text.h5>
                </Styled.TableColumn>
                <Styled.TableColumn>
                  <Text.h5 color="light">{circle.lastUpdate}</Text.h5>
                </Styled.TableColumn>
                <Styled.TableColumn>
                  <Text.h5 color="light">{circle.lifeTime}</Text.h5>
                </Styled.TableColumn>
              </Styled.TableRow>
              {activeRow === circle.id && (
                <Styled.ReleasesWrapper>
                  <ReleasesTable />
                </Styled.ReleasesWrapper>
              )}
            </Styled.CircleRow>
          ))}
        </>
      )}
    </Styled.Table>
  );
};

export default HistoryComponent;
