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
import Styled from './styled';
import ReleaseRow from './ReleaseRow';
import Loader from '../../Loaders/index';
import { useCirclesReleases } from '../hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircleRelease } from '../interfaces';

type Props = {
  circleId: string;
};

const CircleReleasesTable = ({ circleId }: Props) => {
  const page = useRef(0);
  const [releases, setReleases] = useState<CircleRelease[]>([]);
  const { getCircleReleases, response } = useCirclesReleases();
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
      <InfiniteScroll
        dataLength={releases.length}
        next={loadMore}
        hasMore={hasMoreData}
        loader={<Loader.Releases />}
        height={300}
      >
        {releases?.map((release, index) => (
          <ReleaseRow release={release} key={index} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default CircleReleasesTable;
