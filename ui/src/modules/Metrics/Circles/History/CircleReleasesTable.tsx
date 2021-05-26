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

import React, { useEffect, useRef, useState } from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';
import ReleaseRow from './ReleaseRow';
import SummaryRelease from './SummaryRelease';
import Loader from '../../Loaders/index';
import { useCirclesReleases } from '../hooks';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { CircleRelease } from '../interfaces';

type Props = {
  circleId: string;
};

const CircleReleasesTable = ({ circleId }: Props) => {
  const page = useRef(0);
  const [releases, setReleases] = useState<CircleRelease[]>([]);
  const { getCircleReleases, response, loading } = useCirclesReleases();
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
    getCircleReleases({ page: 0 }, circleId);
  }, [getCircleReleases, circleId]);

  const loadMore = () => {
    page.current++;
    getCircleReleases({ page: page.current }, circleId);
  };

  const renderEmpetyReleases = () => (
    <Styled.NoReleaseWrapper>
      <Icon name="not-allowed" color="dark" size="16px" />
      <Text tag="H5" color="dark">Doesn´t exists any release for this circle</Text>
    </Styled.NoReleaseWrapper>
  );

  const renderReleases = () => (
    <>
      <SummaryRelease isLoading={loading} />
      <Styled.TableHead>
        <Styled.TableColumn>
          <Text tag="H5" color="dark">Release</Text>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text tag="H5" color="dark">Deployed</Text>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text tag="H5" color="dark">Undeployed</Text>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text tag="H5" color="dark">Create date</Text>
        </Styled.TableColumn>
        <Styled.TableColumn>
          <Text tag="H5" color="dark">Author</Text>
        </Styled.TableColumn>
      </Styled.TableHead>
      <InfiniteScroll
        hasMore={hasMoreData}
        loadMore={loadMore}
        isLoading={loading}
        loader={<Loader.Releases />}
      >
        {releases?.map((release, index) => (
          <ReleaseRow release={release} key={index} />
        ))}
      </InfiniteScroll>
    </>
  );

  return loading ? (
    <Loader.Releases />
  ) : releases?.length === 0 ? (
    renderEmpetyReleases()
  ) : (
    renderReleases()
  );
};

export default CircleReleasesTable;
