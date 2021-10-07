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
// @ts-nocheck

function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import { useRef, useLayoutEffect, RefObject } from 'react';
type InfiniteScrollArgs = {
  hasMore: boolean;
  loadMore: (page: number) => void;
  distance?: number;
  rootMargin: string;
};
export default function useInfiniteScroll<ScrollElementType extends HTMLElement, LoaderElementType extends HTMLElement>({
  hasMore,
  loadMore,
  rootMargin
}: InfiniteScrollArgs): [RefObject<LoaderElementType>, RefObject<ScrollElementType>, () => void] {
  if (stryMutAct_9fa48("1254")) {
    {}
  } else {
    stryCov_9fa48("1254");
    const page = useRef(0);
    const previousY = useRef(0);
    const previousRatio = useRef(0);
    const scrollContainerRef = useRef<ScrollElementType>(null);
    const loaderRef = useRef<LoaderElementType>(null);

    const resetPage = () => {
      if (stryMutAct_9fa48("1255")) {
        {}
      } else {
        stryCov_9fa48("1255");
        page.current = 0;
      }
    };

    useLayoutEffect(() => {
      if (stryMutAct_9fa48("1256")) {
        {}
      } else {
        stryCov_9fa48("1256");
        const loaderNode = loaderRef.current;
        const scrollContainerNode = scrollContainerRef.current;

        if (stryMutAct_9fa48("1259") ? (!scrollContainerNode || !loaderNode) && !hasMore : stryMutAct_9fa48("1258") ? false : stryMutAct_9fa48("1257") ? true : (stryCov_9fa48("1257", "1258", "1259"), (stryMutAct_9fa48("1262") ? !scrollContainerNode && !loaderNode : stryMutAct_9fa48("1261") ? false : stryMutAct_9fa48("1260") ? true : (stryCov_9fa48("1260", "1261", "1262"), (stryMutAct_9fa48("1263") ? scrollContainerNode : (stryCov_9fa48("1263"), !scrollContainerNode)) || (stryMutAct_9fa48("1264") ? loaderNode : (stryCov_9fa48("1264"), !loaderNode)))) || (stryMutAct_9fa48("1265") ? hasMore : (stryCov_9fa48("1265"), !hasMore)))) {
          if (stryMutAct_9fa48("1266")) {
            {}
          } else {
            stryCov_9fa48("1266");
            return;
          }
        }

        const options: IntersectionObserverInit = stryMutAct_9fa48("1267") ? {} : (stryCov_9fa48("1267"), {
          root: scrollContainerNode,
          rootMargin: rootMargin
        });

        const listener: IntersectionObserverCallback = entries => {
          if (stryMutAct_9fa48("1268")) {
            {}
          } else {
            stryCov_9fa48("1268");
            entries.forEach(({
              isIntersecting,
              intersectionRatio,
              boundingClientRect
            }) => {
              if (stryMutAct_9fa48("1269")) {
                {}
              } else {
                stryCov_9fa48("1269");
                const {
                  y
                } = boundingClientRect;

                if (stryMutAct_9fa48("1272") ? isIntersecting && intersectionRatio >= previousRatio.current || !previousY.current || y < previousY.current : stryMutAct_9fa48("1271") ? false : stryMutAct_9fa48("1270") ? true : (stryCov_9fa48("1270", "1271", "1272"), (stryMutAct_9fa48("1275") ? isIntersecting || intersectionRatio >= previousRatio.current : stryMutAct_9fa48("1274") ? false : stryMutAct_9fa48("1273") ? true : (stryCov_9fa48("1273", "1274", "1275"), isIntersecting && (stryMutAct_9fa48("1279") ? intersectionRatio < previousRatio.current : stryMutAct_9fa48("1278") ? intersectionRatio > previousRatio.current : stryMutAct_9fa48("1277") ? false : stryMutAct_9fa48("1276") ? true : (stryCov_9fa48("1276", "1277", "1278", "1279"), intersectionRatio >= previousRatio.current)))) && (stryMutAct_9fa48("1282") ? !previousY.current && y < previousY.current : stryMutAct_9fa48("1281") ? false : stryMutAct_9fa48("1280") ? true : (stryCov_9fa48("1280", "1281", "1282"), (stryMutAct_9fa48("1283") ? previousY.current : (stryCov_9fa48("1283"), !previousY.current)) || (stryMutAct_9fa48("1287") ? y >= previousY.current : stryMutAct_9fa48("1286") ? y <= previousY.current : stryMutAct_9fa48("1285") ? false : stryMutAct_9fa48("1284") ? true : (stryCov_9fa48("1284", "1285", "1286", "1287"), y < previousY.current)))))) {
                  if (stryMutAct_9fa48("1288")) {
                    {}
                  } else {
                    stryCov_9fa48("1288");
                    stryMutAct_9fa48("1289") ? page.current-- : (stryCov_9fa48("1289"), page.current++);
                    loadMore(page.current);
                  }
                }

                previousY.current = y;
                previousRatio.current = intersectionRatio;
              }
            });
          }
        };

        const observer = new IntersectionObserver(listener, options);
        observer.observe(loaderNode);
        return stryMutAct_9fa48("1290") ? () => undefined : (stryCov_9fa48("1290"), () => observer.disconnect());
      }
    }, stryMutAct_9fa48("1291") ? [] : (stryCov_9fa48("1291"), [hasMore, loadMore, rootMargin]));
    return stryMutAct_9fa48("1292") ? [] : (stryCov_9fa48("1292"), [loaderRef, scrollContainerRef, resetPage]);
  }
}