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

import { useRef, useLayoutEffect, RefObject } from 'react';

type InfiniteScrollArgs = {
  hasMore: boolean;
  loadMore: (page: number) => void;
  distance?: number;
  rootMargin: string;
};

export default function useInfiniteScroll<
  ScrollElementType extends HTMLElement,
  LoaderElementType extends HTMLElement
>({
  hasMore,
  loadMore,
  rootMargin
}: InfiniteScrollArgs): [
  RefObject<LoaderElementType>,
  RefObject<ScrollElementType>,
  () => void
] {
  const page = useRef(0);
  const previousY = useRef(0);
  const previousRatio = useRef(0);
  const scrollContainerRef = useRef<ScrollElementType>(null);
  const loaderRef = useRef<LoaderElementType>(null);

  const resetPage = () => {
    page.current = 0;
  };

  useLayoutEffect(() => {
    const loaderNode = loaderRef.current;
    const scrollContainerNode = scrollContainerRef.current;
    if (!scrollContainerNode || !loaderNode || !hasMore) {
      return;
    }

    const options: IntersectionObserverInit = {
      root: scrollContainerNode,
      rootMargin: rootMargin
    };

    const listener: IntersectionObserverCallback = entries => {
      entries.forEach(
        ({ isIntersecting, intersectionRatio, boundingClientRect }) => {
          const { y } = boundingClientRect;
          if (
            isIntersecting &&
            intersectionRatio >= previousRatio.current &&
            (!previousY.current || y < previousY.current)
          ) {
            page.current++;
            loadMore(page.current);
          }
          previousY.current = y;
          previousRatio.current = intersectionRatio;
        }
      );
    };

    const observer = new IntersectionObserver(listener, options);
    observer.observe(loaderNode);

    return () => observer.disconnect();
  }, [hasMore, loadMore, rootMargin]);

  return [loaderRef, scrollContainerRef, resetPage];
}
