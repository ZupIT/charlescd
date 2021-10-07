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
import { configPath } from 'core/providers/circleMatcher';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps, useFetchData } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { useDispatch } from 'core/state/hooks';
type DeleteCircleMatcher = {
  deleteCircleMatcher: () => Promise<Response>;
};
export const useDeleteCircleMatcher = (): DeleteCircleMatcher => {
  if (stryMutAct_9fa48("5567")) {
    {}
  } else {
    stryCov_9fa48("5567");
    const deleteCM = useFetchData<Response>(delConfig);
    const dispatch = useDispatch();

    const deleteCircleMatcher = async () => {
      if (stryMutAct_9fa48("5568")) {
        {}
      } else {
        stryCov_9fa48("5568");

        try {
          if (stryMutAct_9fa48("5569")) {
            {}
          } else {
            stryCov_9fa48("5569");
            const res = await deleteCM(configPath);
            dispatch(toogleNotification(stryMutAct_9fa48("5570") ? {} : (stryCov_9fa48("5570"), {
              text: stryMutAct_9fa48("5571") ? "" : (stryCov_9fa48("5571"), 'Success deleting circle matcher'),
              status: stryMutAct_9fa48("5572") ? "" : (stryCov_9fa48("5572"), 'success')
            })));
            return res;
          }
        } catch (e) {
          if (stryMutAct_9fa48("5573")) {
            {}
          } else {
            stryCov_9fa48("5573");
            dispatch(toogleNotification(stryMutAct_9fa48("5574") ? {} : (stryCov_9fa48("5574"), {
              text: stryMutAct_9fa48("5575") ? `` : (stryCov_9fa48("5575"), `[${e.status}] Circle Matcher could not be removed.`),
              status: stryMutAct_9fa48("5576") ? "" : (stryCov_9fa48("5576"), 'error')
            })));
          }
        }
      }
    };

    return stryMutAct_9fa48("5577") ? {} : (stryCov_9fa48("5577"), {
      deleteCircleMatcher
    });
  }
};
export const useCircleMatcher = (): FetchProps => {
  if (stryMutAct_9fa48("5578")) {
    {}
  } else {
    stryCov_9fa48("5578");
    const dispatch = useDispatch();
    const [addData, addCircleMatcher] = useFetch(addConfig);
    const [removeData, delCircleMatcher] = useFetch(delConfig);
    const {
      loading: loadingAdd,
      response: responseAdd,
      error
    } = addData;
    const {
      response: responseRemove,
      error: errorRemove
    } = removeData;
    const save = useCallback((url: string) => {
      if (stryMutAct_9fa48("5579")) {
        {}
      } else {
        stryCov_9fa48("5579");
        addCircleMatcher(configPath, url);
      }
    }, stryMutAct_9fa48("5580") ? [] : (stryCov_9fa48("5580"), [addCircleMatcher]));
    useEffect(() => {
      if (stryMutAct_9fa48("5581")) {
        {}
      } else {
        stryCov_9fa48("5581");

        if (stryMutAct_9fa48("5583") ? false : stryMutAct_9fa48("5582") ? true : (stryCov_9fa48("5582", "5583"), error)) {
          if (stryMutAct_9fa48("5584")) {
            {}
          } else {
            stryCov_9fa48("5584");
            dispatch(toogleNotification(stryMutAct_9fa48("5585") ? {} : (stryCov_9fa48("5585"), {
              text: stryMutAct_9fa48("5586") ? `` : (stryCov_9fa48("5586"), `[${error.status}] Circle Matcher could not be saved.`),
              status: stryMutAct_9fa48("5587") ? "" : (stryCov_9fa48("5587"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5588") ? [] : (stryCov_9fa48("5588"), [error, dispatch]));
    const remove = useCallback(() => {
      if (stryMutAct_9fa48("5589")) {
        {}
      } else {
        stryCov_9fa48("5589");
        delCircleMatcher(configPath);
      }
    }, stryMutAct_9fa48("5590") ? [] : (stryCov_9fa48("5590"), [delCircleMatcher]));
    useEffect(() => {
      if (stryMutAct_9fa48("5591")) {
        {}
      } else {
        stryCov_9fa48("5591");

        if (stryMutAct_9fa48("5593") ? false : stryMutAct_9fa48("5592") ? true : (stryCov_9fa48("5592", "5593"), errorRemove)) {
          if (stryMutAct_9fa48("5594")) {
            {}
          } else {
            stryCov_9fa48("5594");
            dispatch(toogleNotification(stryMutAct_9fa48("5595") ? {} : (stryCov_9fa48("5595"), {
              text: stryMutAct_9fa48("5596") ? `` : (stryCov_9fa48("5596"), `[${errorRemove.status}] Circle Matcher could not be removed.`),
              status: stryMutAct_9fa48("5597") ? "" : (stryCov_9fa48("5597"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5598") ? [] : (stryCov_9fa48("5598"), [errorRemove, dispatch]));
    useEffect(() => {
      if (stryMutAct_9fa48("5599")) {
        {}
      } else {
        stryCov_9fa48("5599");

        if (stryMutAct_9fa48("5601") ? false : stryMutAct_9fa48("5600") ? true : (stryCov_9fa48("5600", "5601"), responseRemove)) {
          if (stryMutAct_9fa48("5602")) {
            {}
          } else {
            stryCov_9fa48("5602");
            dispatch(toogleNotification(stryMutAct_9fa48("5603") ? {} : (stryCov_9fa48("5603"), {
              text: stryMutAct_9fa48("5604") ? "" : (stryCov_9fa48("5604"), 'Success deleting circle matcher'),
              status: stryMutAct_9fa48("5605") ? "" : (stryCov_9fa48("5605"), 'success')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5606") ? [] : (stryCov_9fa48("5606"), [responseRemove, dispatch]));
    return stryMutAct_9fa48("5607") ? {} : (stryCov_9fa48("5607"), {
      responseAdd,
      responseRemove,
      loadingAdd,
      save,
      remove
    });
  }
};