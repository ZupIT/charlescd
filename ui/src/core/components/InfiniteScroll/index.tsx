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

import useInfiniteScroll from 'core/hooks/useInfiniteScroll';
import React, { useEffect, ReactNode, Children } from 'react';
import Styled from './styled';

type Props = {
  children: ReactNode;
  loader: ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  loadMore: (page: number) => void;
  rootMargin?: string;
};

const InfiniteScroll = ({
  children,
  loader,
  isLoading,
  hasMore,
  loadMore,
  rootMargin = '1px'
}: Props) => {
  const childrenLength = Children.count(children);
  const showSentinelLoader = !isLoading && childrenLength && hasMore;

  const [loaderRef, scrollerRef, resetPage] = useInfiniteScroll<
    HTMLDivElement,
    HTMLDivElement
  >({ hasMore, loadMore, rootMargin });

  useEffect(() => {
    if (childrenLength === 0) {
      resetPage();
    }
  }, [childrenLength, resetPage]);

  return (
    <Styled.List ref={scrollerRef}>
      {children}
      {isLoading && <div data-testid="user-loader">{loader}</div>}
      <Styled.Loader
        data-testid="sentinel-loader"
        ref={loaderRef}
        isVisible={showSentinelLoader}
      />
    </Styled.List>
  );
};

export default InfiniteScroll;
