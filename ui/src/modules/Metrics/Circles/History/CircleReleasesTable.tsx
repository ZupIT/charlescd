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
import Styled from './styled';
import ReleaseComponentsTable from './ReleaseComponentsTable';
import Loader from '../../Loaders/index';
import { useCirclesReleases } from '../hooks';

type Props = {
  circleId: string;
};

const CircleReleasesTable = ({ circleId }: Props) => {
  const [activeRow, setActiveRow] = useState('');
  const { getCircleReleases, releases, loading } = useCirclesReleases();

  const expandRow = (id: string) => {
    if (id === activeRow) {
      setActiveRow('');
    } else {
      setActiveRow(id);
    }
  };

  useEffect(() => {
    getCircleReleases(circleId);
  }, [circleId, getCircleReleases]);

  return (
    <>
      <Styled.TableHead>
        <Styled.TableColumn>
          <Text.h5 color="dark">Release</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="dark">Deployed</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="dark">Undeployed</Text.h5>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text.h5 color="dark">Last editor</Text.h5>
        </Styled.TableColumn>
      </Styled.TableHead>
      {loading ? (
        <Loader.Releases />
      ) : (
        <>
          {releases?.map(release => (
            <Styled.ReleaseRow key={release.id}>
              <Styled.TableRow onClick={() => expandRow(release.id)}>
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
              {activeRow === release.id && (
                <Styled.ReleasesWrapper>
                  <ReleaseComponentsTable components={release.components} />
                </Styled.ReleasesWrapper>
              )}
            </Styled.ReleaseRow>
          ))}
        </>
      )}
    </>
  );
};

export default CircleReleasesTable;
