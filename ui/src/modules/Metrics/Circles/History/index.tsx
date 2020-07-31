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

import React, { useRef, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Text from 'core/components/Text';
import Styled from './styled';
import CircleRow from './CircleRow';
import { useCirclesHistory } from '../hooks';
import Loader from '../../Loaders';
import { CircleHistory } from '../interfaces';
import Summary from './Summary';

const HistoryComponent = () => {
  const page = useRef(0);
  const [name, setName] = useState('');
  const [circles, setCircles] = useState<CircleHistory[]>([]);
  const { getCirclesHistory, response, loading } = useCirclesHistory();
  const historyResponse = response?.content;
  const hasMoreData = !response?.last;

  useEffect(() => {
    if (historyResponse) {
      setCircles((prevCircles: CircleHistory[]) => [
        ...prevCircles,
        ...historyResponse
      ]);
    }
  }, [historyResponse]);

  useEffect(() => {
    page.current = 0;
    setCircles([]);
    getCirclesHistory({ page: 0, name });
  }, [getCirclesHistory, name]);

  const loadMore = () => {
    page.current++;
    getCirclesHistory({ page: page.current, name });
  };

  return (
    <Styled.HistoryWrapper>
      <Summary isLoading={loading} onSearch={setName} />
      <Styled.Table>
        <Styled.TableHead>
          <Styled.TableColumn>
            <Text.h5 color="dark">Circles</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn>
            <Text.h5 color="dark">Last update</Text.h5>
          </Styled.TableColumn>
          <Styled.TableColumn>
            <Text.h5 color="dark">Life time</Text.h5>
          </Styled.TableColumn>
        </Styled.TableHead>
        <Styled.CircleRowWrapper>
          <InfiniteScroll
            dataLength={circles.length}
            next={loadMore}
            hasMore={hasMoreData}
            loader={<Loader.History />}
            height={500}
          >
            {circles?.map(circle => (
              <CircleRow circle={circle} key={circle.id} />
            ))}
          </InfiniteScroll>
        </Styled.CircleRowWrapper>
      </Styled.Table>
    </Styled.HistoryWrapper>
  );
};

export default HistoryComponent;
