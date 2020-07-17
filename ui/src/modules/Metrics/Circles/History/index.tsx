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
import { useCirclesHistory } from '../hooks';
import Loader from '../../Loaders';
import { CircleHistory } from '../interfaces';
import Summary from './Summary';

const HistoryComponent = () => {
  const [element, setElement] = useState(null);
  const page = useRef(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [name, setName] = useState('');
  const [circles, setCircles] = useState<CircleHistory[]>([]);
  const { getCirclesHistory, response, loading } = useCirclesHistory();
  const historyResponse = response?.page?.content;
  const hasMoreData = !response?.page?.isLast;

  useEffect(() => {
    setCircles([]);
    page.current = 0;
    getCirclesHistory({ page: page.current, name });
  }, [getCirclesHistory, name]);

  useEffect(() => {
    if (historyResponse) {
      setCircles((prevCircles: CircleHistory[]) => [
        ...prevCircles,
        ...historyResponse
      ]);
      setIsIntersecting(false);
    }
  }, [historyResponse]);

  useEffect(() => {
    if (isIntersecting) {
      page.current++;
      getCirclesHistory({ page: page.current, name });
    }
  }, [isIntersecting, getCirclesHistory, name]);

  const prevY = useRef(0);
  const observer = useRef(
    new IntersectionObserver(
      ([firstEntry]) => {
        const y = firstEntry.boundingClientRect.y;
        if (prevY.current > y) {
          setIsIntersecting(true);
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
          {hasMoreData && circles?.length > 0 && (
            <div ref={setElement}>
              <Loader.History />
            </div>
          )}
          {loading && circles?.length === 0 && <Loader.History />}
        </Styled.CircleRowWrapper>
      </Styled.Table>
    </Styled.HistoryWrapper>
  );
};

export default HistoryComponent;
