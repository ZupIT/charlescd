// @ts-nocheck
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

import { useCallback, useEffect } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { circleMatcherIdentify } from 'core/providers/circle';
import { ParameterPayload, CircleMatcherResult } from './interfaces';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';

const useCircleMatcher = (): [CircleMatcherResult[], boolean, Function] => {
  if (stryMutAct_9fa48("3560")) {
    {}
  } else {
    stryCov_9fa48("3560");
    const dispatch = useDispatch();
    const [circles, getCircleMatcherCircles] = useFetch<CircleMatcherResult[]>(circleMatcherIdentify);
    const {
      response,
      loading,
      error
    } = circles;
    useEffect(() => {
      if (stryMutAct_9fa48("3561")) {
        {}
      } else {
        stryCov_9fa48("3561");

        if (stryMutAct_9fa48("3563") ? false : stryMutAct_9fa48("3562") ? true : (stryCov_9fa48("3562", "3563"), error)) {
          if (stryMutAct_9fa48("3564")) {
            {}
          } else {
            stryCov_9fa48("3564");
            dispatch(toogleNotification(stryMutAct_9fa48("3565") ? {} : (stryCov_9fa48("3565"), {
              text: stryMutAct_9fa48("3566") ? `` : (stryCov_9fa48("3566"), `Error performing circle matcher try out`),
              status: stryMutAct_9fa48("3567") ? "" : (stryCov_9fa48("3567"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("3568") ? [] : (stryCov_9fa48("3568"), [error, dispatch]));
    const identifyCircles = useCallback((data: ParameterPayload) => {
      if (stryMutAct_9fa48("3569")) {
        {}
      } else {
        stryCov_9fa48("3569");
        getCircleMatcherCircles(data);
      }
    }, stryMutAct_9fa48("3570") ? [] : (stryCov_9fa48("3570"), [getCircleMatcherCircles]));
    return stryMutAct_9fa48("3571") ? [] : (stryCov_9fa48("3571"), [response, loading, identifyCircles]);
  }
};

export default useCircleMatcher;