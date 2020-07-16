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
import Text from 'core/components/Text';
import Styled from './styled';
import CircleRow from './CircleRow';
import Summary from './Summary';
import { useCirclesHistory } from '../hooks';
import Loader from '../../Loaders';
import { CircleHistory } from '../interfaces';

const HistoryComponent = () => {
  const [element, setElement] = useState(null);
  const [name, setName] = useState('');
  const page = useRef(0);
  const [circles, setCircles] = useState<CircleHistory[]>([]);
  const { getCirclesHistory, response, loading } = useCirclesHistory();
  const historyResponse = response?.page?.content;

  useEffect(() => {
    getCirclesHistory({ page: 0, name });
  }, [getCirclesHistory, name]);

  useEffect(() => {
    if (historyResponse) {
      setCircles((prevCircles: CircleHistory[]) => [
        ...prevCircles,
        ...historyResponse
      ]);
    }
  }, [historyResponse]);

  const loadMore = () => {
    page.current++;
    getCirclesHistory({ page: page.current, name });
  };

  const prevY = useRef(0);
  const observer = useRef(
    new IntersectionObserver(
      ([firstEntry]) => {
        const y = firstEntry.boundingClientRect.y;
        if (prevY.current > y) {
          loadMore();
        }
        prevY.current = y;
      },
      { threshold: 0.2 }
    )
  );

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

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
        <Styled.CircleRowWrapper>
          {circles?.map((circle: CircleHistory, index: number) => (
            <CircleRow circle={circle} key={index} />
          ))}
          <div ref={setElement}>
            <Loader.History />
          </div>
        </Styled.CircleRowWrapper>
      </Styled.Table>
    </Styled.HistoryWrapper>
  );
};

export default HistoryComponent;
