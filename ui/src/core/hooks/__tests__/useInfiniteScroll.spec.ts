import { renderHook, act } from '@testing-library/react-hooks';
import {
  intersectionMockInstance,
  mockIsIntersecting,
} from 'react-intersection-observer/test-utils';

import useInfiniteScroll from '../useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let hook: any;
  let scrollerNode = document.createElement('div');
  let loaderNode = document.createElement('div');
  let loadMore = jest.fn();

  beforeEach(async () => {
    hook = renderHook(({ hasMore }) => useInfiniteScroll<HTMLDivElement, HTMLDivElement>({ hasMore, loadMore }), {
      initialProps: { hasMore: false },
    });
    const [loaderRef, scrollerRef, resetPage] = hook.result.current;
    loaderRef.current = loaderNode;
    scrollerRef.current = scrollerNode;

    hook.rerender({ hasMore: true });
  });

  it('should observe the loader node', () => {
    const observer = intersectionMockInstance(loaderNode);
    expect(observer).toBeDefined();
    expect(observer.observe).toHaveBeenCalledWith(loaderNode);
  });

  it('should switch to next page when reaching loaderNode intersection', () => {
    act(() => mockIsIntersecting(loaderNode, true));
    
    expect(loadMore).toHaveBeenCalledWith(1);
  });

  it('should reset page after intersection', () => {
    act(() => mockIsIntersecting(loaderNode, true));
    const [,, resetPage] = hook.result.current;
    expect(loadMore).toHaveBeenCalledWith(1);
    resetPage();
    expect(loadMore).toHaveBeenCalledWith(1);
  });

  it('should disconnect when there are no more results', () => {
    const observer = intersectionMockInstance(loaderNode);
    expect(observer.disconnect).not.toHaveBeenCalled();

    hook.rerender({ hasMore: false });
    expect(observer.disconnect).toHaveBeenCalled();
  });
});