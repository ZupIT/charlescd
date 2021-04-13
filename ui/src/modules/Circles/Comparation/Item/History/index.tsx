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

import React, { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircleRelease } from 'modules/Metrics/Circles/interfaces';
import Text from 'core/components/Text';
import { dateTimeFormatterWithTab } from 'core/utils/date';
import Icon from 'core/components/Icon';
import camelCase from 'lodash/camelCase';
import LogModal from './Logs';
import { getReleaseStatus } from './helpers';
import { useCircleDeployHistory } from './hooks';
import Loader from './Loaders';
import Styled from './styled';

type Props = {
  id: string;
  onGoBack: Function;
}

const DeployHistory = ({ onGoBack, id }: Props) => {
  const page = useRef(0);
  const [toggleModal, setToggleModal] = useState(false);
  const [releases, setReleases] = useState<CircleRelease[]>([]);
  const { getCircleReleases, response } = useCircleDeployHistory();
  const releasesResponse = response?.content;
  const hasMoreData = !response?.last;

  useEffect(() => {
    if (releasesResponse) {
      setReleases((prevCircles: CircleRelease[]) => [
        ...prevCircles,
        ...releasesResponse
      ]);
    }
  }, [releasesResponse]);

  useEffect(() => {
    page.current = 0;
    setReleases([]);
    getCircleReleases({ page: 0 }, id);
  }, [getCircleReleases, id]);

  const loadMore = () => {
    page.current++;
    getCircleReleases({ page: page.current }, id);
  };

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
          <Icon name="clock" color="dark" size={'25px'} />
          <Text.h2 color="light">History</Text.h2>
        </Styled.Title>
        <InfiniteScroll
        dataLength={releases.length}
        next={loadMore}
        hasMore={hasMoreData}
        loader={<Loader.History />}
        height={690}
      >
        {releases?.map((release, index) => (
          <>
            {toggleModal && (
              <LogModal 
                onGoBack={() => setToggleModal(false)} 
                deploymentId={release.id}
              />)}
            <Styled.DeploymentRow key={index}>
              <Styled.TableRow>
                <Styled.TableTextName color="light" title={release.authorName}>
                  {release.authorName}
                </Styled.TableTextName>
                <Styled.TableDate color="light" >
                  {release.deployedAt ? dateTimeFormatterWithTab(release.deployedAt) : '-'}
                </Styled.TableDate>
                <Styled.TableDeployStatus>
                  <Styled.Dot status={getReleaseStatus(release?.status)}/>
                  <Styled.TableDeployStatusName color="light">
                    {camelCase(release.status)}
                  </Styled.TableDeployStatusName>
                </Styled.TableDeployStatus>
                <Styled.TableExpand 
                  name="expand" 
                  color="light"
                  size={'16px'}
                  onClick={() => setToggleModal(true)}
                />
              </Styled.TableRow>
              <Styled.ReleaseRow>
                <Styled.TableTextRelease color="light" title={release.tag}>
                  {release.tag}
                </Styled.TableTextRelease>
              </Styled.ReleaseRow>
            </Styled.DeploymentRow>
          </>
        ))}
        </InfiniteScroll>
      </Styled.Layer>
    </>
  );
};

export default DeployHistory;
