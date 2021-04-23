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
import Icon from 'core/components/Icon';
import isEmpty from 'lodash/isEmpty';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import LogModal from './Logs';
import { getReleaseStatus, getActionDateTime } from './helpers';
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
  const [logDeploymentId, setLogDeploymentId] = useState<string>();
  const [releases, setReleases] = useState<CircleRelease[]>([]);
  const { getCircleReleases, response, loading } = useCircleDeployHistory();
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

  const openLogModal = (releaseId: string) => {
    setLogDeploymentId(releaseId);
    setToggleModal(true);
  };

  return (
    <>
      {toggleModal && (
        <LogModal 
          onGoBack={() => setToggleModal(false)} 
          deploymentId={logDeploymentId}
        />
      )}
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
        {(!loading && isEmpty(releases)) && (
          <Styled.NoHistoryPlaceholder
            icon="error-403"
          >
            <Styled.NoHistoryText color="dark" weight="bold" align="center">
              No deployment history available
            </Styled.NoHistoryText>
          </Styled.NoHistoryPlaceholder>
        )}
        {releases?.map((release, index) => (
          <>
            <Styled.DeploymentRow key={index}>
              <Styled.TableRow>
                <Styled.TableTextName color="light" title={release.authorEmail}>
                  {release.authorEmail}
                </Styled.TableTextName>
                <Styled.TableDate color="light" >
                  {getActionDateTime(release.deployedAt, release.undeployedAt) }
                </Styled.TableDate>
                <Styled.TableDeployStatus>
                  <Styled.Dot status={camelCase(getReleaseStatus(release.status))}/>
                  <Styled.TableDeployStatusName color="light">
                    {startCase(getReleaseStatus(release.status))}
                  </Styled.TableDeployStatusName>
                </Styled.TableDeployStatus>
                <Styled.TableExpand 
                  name="expand" 
                  color="light"
                  size={'16px'}
                  onClick={() => openLogModal(release.id)}
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
