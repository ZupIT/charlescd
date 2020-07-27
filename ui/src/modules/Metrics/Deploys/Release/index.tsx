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
import Summary from './Summary';
import Loader from '../../Loaders/index';
import { useReleaseHistory } from '../hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReleaseHistory, ReleaseHistoryRequest } from '../interfaces';

type Props = {
  filter: ReleaseHistoryRequest;
};

const ReleasesHistoryComponent = ({ filter }: Props) => {
  const page = useRef(0);
  const [releases, setReleases] = useState<ReleaseHistory[]>([]);
  const { getReleaseHistory, response, loading } = useReleaseHistory();
  const releasesResponse = response?.page?.content;
  const hasMoreData = !response?.page?.last;

  useEffect(() => {
    if (releasesResponse) {
      setReleases((prevCircles: ReleaseHistory[]) => [
        ...prevCircles,
        ...releasesResponse
      ]);
    }
  }, [releasesResponse]);

  useEffect(() => {
    const { period, circles } = filter;
    page.current = 0;
    setReleases([]);
    getReleaseHistory({ page: 0 }, { circles, period });
  }, [getReleaseHistory, filter]);

  const loadMore = () => {
    const { period, circles } = filter;
    page.current++;
    getReleaseHistory({ page: page.current }, { circles, period });
  };

  return (
    <Styled.ReleaseHistoryWrapper data-testid="release-history">
      <Summary legend={response?.summary} isLoading={loading} />
      <Styled.Table>
        <Styled.TableHead>
          <Styled.TableColumn>
            <Text.h5 color="dark">Release Name</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn>
            <Text.h5 color="dark">Cirles</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn>
            <Text.h5 color="dark">Deploy data</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn>
            <Text.h5 color="dark">Deploy duration</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn>
            <Text.h5 color="dark">Undeploy data</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn>
            <Text.h5 color="dark">Responsible</Text.h5>
          </Styled.TableColumn>
        </Styled.TableHead>
        <InfiniteScroll
          dataLength={releases.length}
          next={loadMore}
          hasMore={hasMoreData}
          loader={<Loader.Releases />}
          height={540}
        >
          {releases?.map((release, index) => (
            <ReleaseRow release={release} key={index} />
          ))}
        </InfiniteScroll>
      </Styled.Table>
    </Styled.ReleaseHistoryWrapper>
  );
};

export default ReleasesHistoryComponent;
