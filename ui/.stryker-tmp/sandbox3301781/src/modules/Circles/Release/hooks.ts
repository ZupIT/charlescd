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

import { useCallback, useEffect, useState } from 'react';
import { useFetch, useFetchData, useFetchStatus, FetchStatus } from 'core/providers/base/hooks';
import { findComponentTags } from 'core/providers/modules';
import { composeBuild as postComposeBuild, findBuilds } from 'core/providers/builds';
import { createDeployment as postCreateDeployment } from 'core/providers/deployment';
import { URLParams } from 'core/utils/query';
import { Pagination } from 'core/interfaces/Pagination';
import { Build, FilterBuild } from './interfaces/Build';
import { CreateDeployment } from './interfaces/Deployment';
import { Deployment } from '../interfaces/Circle';
import { Tag } from './interfaces/Tag';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
export const useComponentTags = (): {
  getComponentTag: Function;
  tag: Tag;
  status: FetchStatus;
} => {
  if (stryMutAct_9fa48("3688")) {
    {}
  } else {
    stryCov_9fa48("3688");
    const getTags = useFetchData<Tag[]>(findComponentTags);
    const status = useFetchStatus();
    const [tag, setTag] = useState(null);

    const getComponentTag = async (moduleId: string, componentId: string, params: URLParams) => {
      if (stryMutAct_9fa48("3689")) {
        {}
      } else {
        stryCov_9fa48("3689");

        try {
          if (stryMutAct_9fa48("3690")) {
            {}
          } else {
            stryCov_9fa48("3690");

            if (stryMutAct_9fa48("3692") ? false : stryMutAct_9fa48("3691") ? true : (stryCov_9fa48("3691", "3692"), params.name)) {
              if (stryMutAct_9fa48("3693")) {
                {}
              } else {
                stryCov_9fa48("3693");
                status.pending();
                const res = await getTags(moduleId, componentId, params);
                const [tag] = res;
                setTag(tag);
                status.resolved();
                return tag;
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("3694")) {
            {}
          } else {
            stryCov_9fa48("3694");
            status.rejected();
          }
        }
      }
    };

    return stryMutAct_9fa48("3695") ? {} : (stryCov_9fa48("3695"), {
      getComponentTag,
      tag,
      status
    });
  }
};
export const useComposeBuild = (): {
  composeBuild: Function;
  response: Build;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("3696")) {
    {}
  } else {
    stryCov_9fa48("3696");
    const dispatch = useDispatch();
    const [data, composeBuild] = useFetch<Build>(postComposeBuild);
    const {
      response,
      error,
      loading
    } = data;
    useEffect(() => {
      if (stryMutAct_9fa48("3697")) {
        {}
      } else {
        stryCov_9fa48("3697");

        (async () => {
          if (stryMutAct_9fa48("3698")) {
            {}
          } else {
            stryCov_9fa48("3698");

            if (stryMutAct_9fa48("3700") ? false : stryMutAct_9fa48("3699") ? true : (stryCov_9fa48("3699", "3700"), error)) {
              if (stryMutAct_9fa48("3701")) {
                {}
              } else {
                stryCov_9fa48("3701");
                const e = await error.json();
                dispatch(toogleNotification(stryMutAct_9fa48("3702") ? {} : (stryCov_9fa48("3702"), {
                  text: stryMutAct_9fa48("3703") ? `` : (stryCov_9fa48("3703"), `${error.status}: ${stryMutAct_9fa48("3704") ? e.message : (stryCov_9fa48("3704"), e?.message)}`),
                  status: stryMutAct_9fa48("3705") ? "" : (stryCov_9fa48("3705"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("3706") ? [] : (stryCov_9fa48("3706"), [dispatch, error]));
    return stryMutAct_9fa48("3707") ? {} : (stryCov_9fa48("3707"), {
      composeBuild,
      response,
      loading
    });
  }
};
export const useCreateDeployment = (): {
  createDeployment: Function;
  response: Deployment;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("3708")) {
    {}
  } else {
    stryCov_9fa48("3708");
    const dispatch = useDispatch();
    const [data, createDeploy] = useFetch<Deployment>(postCreateDeployment);
    const {
      response,
      error,
      loading
    } = data;
    const createDeployment = useCallback((data: CreateDeployment) => {
      if (stryMutAct_9fa48("3709")) {
        {}
      } else {
        stryCov_9fa48("3709");
        createDeploy(data);
      }
    }, stryMutAct_9fa48("3710") ? [] : (stryCov_9fa48("3710"), [createDeploy]));
    useEffect(() => {
      if (stryMutAct_9fa48("3711")) {
        {}
      } else {
        stryCov_9fa48("3711");

        (async () => {
          if (stryMutAct_9fa48("3712")) {
            {}
          } else {
            stryCov_9fa48("3712");

            if (stryMutAct_9fa48("3714") ? false : stryMutAct_9fa48("3713") ? true : (stryCov_9fa48("3713", "3714"), error)) {
              if (stryMutAct_9fa48("3715")) {
                {}
              } else {
                stryCov_9fa48("3715");
                const e = await error.json();
                dispatch(toogleNotification(stryMutAct_9fa48("3716") ? {} : (stryCov_9fa48("3716"), {
                  text: stryMutAct_9fa48("3717") ? `` : (stryCov_9fa48("3717"), `${error.status}: ${stryMutAct_9fa48("3718") ? e.message : (stryCov_9fa48("3718"), e?.message)}`),
                  status: stryMutAct_9fa48("3719") ? "" : (stryCov_9fa48("3719"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("3720") ? [] : (stryCov_9fa48("3720"), [dispatch, error]));
    return stryMutAct_9fa48("3721") ? {} : (stryCov_9fa48("3721"), {
      createDeployment,
      response,
      loading
    });
  }
};
export const useFindBuilds = (): {
  getBuilds: Function;
  response: Pagination<Build>;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("3722")) {
    {}
  } else {
    stryCov_9fa48("3722");
    const [data, request] = useFetch<Pagination<Build>>(findBuilds);
    const {
      response,
      loading
    } = data;
    const getBuilds = useCallback((data: FilterBuild) => {
      if (stryMutAct_9fa48("3723")) {
        {}
      } else {
        stryCov_9fa48("3723");
        request(data);
      }
    }, stryMutAct_9fa48("3724") ? [] : (stryCov_9fa48("3724"), [request]));
    return stryMutAct_9fa48("3725") ? {} : (stryCov_9fa48("3725"), {
      getBuilds,
      response,
      loading
    });
  }
};