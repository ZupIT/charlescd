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
import { History } from '../interfaces';

const HistoryComponent = () => {
  const [element, setElement] = useState(null);
  const page = useRef(0);
  const [circles, setCircles] = useState<History[]>([]);
  const { findCirclesHistory, response } = useCirclesHistory();

  console.log(response);

  useEffect(() => {
    findCirclesHistory({ page: 0 });
  }, [findCirclesHistory]);

  useEffect(() => {
    if (response) {
      setCircles((prevCircles: History[]) => [
        ...prevCircles,
        ...response.history
      ]);
    }
  }, [response]);

  const loadMore = () => {
    page.current++;
    findCirclesHistory({ page: page.current });
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
        {circles?.map((circle: History, index: number) => (
          <CircleRow circle={circle} key={index} />
        ))}
        <div ref={setElement}>
          <Loader.History />
        </div>
      </Styled.CircleRowWrapper>
    </Styled.Table>
  );
};

export default HistoryComponent;
