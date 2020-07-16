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

import React, { useRef, useState, useEffect, RefObject, useCallback } from 'react';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import Text from 'core/components/Text';
import Styled from './styled';
import CircleRow from './CircleRow';
import Summary from './Summary';
import { useCirclesHistory } from '../hooks';
import Loader from '../../Loaders';
import { CircleHistory } from '../interfaces';

const HistoryComponent = () => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [name, setName] = useState('');
  const page = useRef(0);
  const [circles, setCircles] = useState<CircleHistory[]>([]);
  const { getCirclesHistory, response, loading } = useCirclesHistory();
  const historyResponse = response?.page?.content;

  const handleLoadMore = useCallback(() => {
    console.log('should load more');

    getCirclesHistory({ page: page.current, name });
    page.current++;
  }, []);

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: handleLoadMore,
    scrollContainer: 'parent'
  });

  useEffect(() => {
    if (historyResponse) {
      setCircles((prevCircles: CircleHistory[]) => [
        ...prevCircles,
        ...historyResponse
      ]);
      setHasNextPage(!response?.page?.isLast);
    }
  }, [historyResponse]);

  return (
    <Styled.HistoryWrapper>
      <Summary
        legend={response?.summary}
        legendLoading={loading}
        onSearch={setName}
      />
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
        <div ref={infiniteRef as RefObject<HTMLDivElement>}>
          <Styled.CircleRowWrapper>
            {circles?.map((circle: CircleHistory, index: number) => (
              <CircleRow circle={circle} key={index} />
            ))}
            <Loader.History />
          </Styled.CircleRowWrapper>
        </div>
      </Styled.Table>
    </Styled.HistoryWrapper>
  );
};

export default HistoryComponent;
