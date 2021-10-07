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

import { useCallback, useState } from 'react';
import { useDispatch } from 'core/state/hooks';
import { saveConfig, delConfig, getConfig, editConfig } from 'core/providers/webhook';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { Webhook } from './interfaces';
interface Props {
  status: FetchStatuses;
  save: (webhook: Webhook) => Promise<unknown>;
  remove: (id: string, description?: string) => Promise<unknown>;
  list: (id: string) => Promise<unknown>;
  edit: (id: string, value: string[]) => Promise<unknown>;
}
export const useWebhook = (): Props => {
  if (stryMutAct_9fa48("6290")) {
    {}
  } else {
    stryCov_9fa48("6290");
    const dispatch = useDispatch();
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6291") ? "" : (stryCov_9fa48("6291"), 'idle'));
    const saving = useFetchData(saveConfig);
    const removing = useFetchData(delConfig);
    const listing = useFetchData(getConfig);
    const editing = useFetchData(editConfig);
    const save = useCallback(async (webhook: Webhook) => {
      if (stryMutAct_9fa48("6292")) {
        {}
      } else {
        stryCov_9fa48("6292");

        try {
          if (stryMutAct_9fa48("6293")) {
            {}
          } else {
            stryCov_9fa48("6293");
            setStatus(stryMutAct_9fa48("6294") ? "" : (stryCov_9fa48("6294"), 'pending'));
            const response = await saving(webhook);
            setStatus(stryMutAct_9fa48("6295") ? "" : (stryCov_9fa48("6295"), 'resolved'));
            return response;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6296")) {
            {}
          } else {
            stryCov_9fa48("6296");
            setStatus(stryMutAct_9fa48("6297") ? "" : (stryCov_9fa48("6297"), 'rejected'));
            const error = await e.json();
            dispatch(toogleNotification(stryMutAct_9fa48("6298") ? {} : (stryCov_9fa48("6298"), {
              text: stryMutAct_9fa48("6299") ? `` : (stryCov_9fa48("6299"), `[${e.status}] ${error.message}`),
              status: stryMutAct_9fa48("6300") ? "" : (stryCov_9fa48("6300"), 'error')
            })));
            return Promise.reject(error);
          }
        }
      }
    }, stryMutAct_9fa48("6301") ? [] : (stryCov_9fa48("6301"), [saving, dispatch]));
    const remove = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("6302")) {
        {}
      } else {
        stryCov_9fa48("6302");

        try {
          if (stryMutAct_9fa48("6303")) {
            {}
          } else {
            stryCov_9fa48("6303");
            setStatus(stryMutAct_9fa48("6304") ? "" : (stryCov_9fa48("6304"), 'pending'));
            const response = await removing(id);
            setStatus(stryMutAct_9fa48("6305") ? "" : (stryCov_9fa48("6305"), 'resolved'));
            dispatch(toogleNotification(stryMutAct_9fa48("6306") ? {} : (stryCov_9fa48("6306"), {
              text: stryMutAct_9fa48("6307") ? "" : (stryCov_9fa48("6307"), 'Success deleting webhook'),
              status: stryMutAct_9fa48("6308") ? "" : (stryCov_9fa48("6308"), 'success')
            })));
            return response;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6309")) {
            {}
          } else {
            stryCov_9fa48("6309");
            setStatus(stryMutAct_9fa48("6310") ? "" : (stryCov_9fa48("6310"), 'rejected'));
            const error = await e.json();
            dispatch(toogleNotification(stryMutAct_9fa48("6311") ? {} : (stryCov_9fa48("6311"), {
              text: stryMutAct_9fa48("6312") ? `` : (stryCov_9fa48("6312"), `[${e.status}] ${error.message}`),
              status: stryMutAct_9fa48("6313") ? "" : (stryCov_9fa48("6313"), 'error')
            })));
            return Promise.reject(error);
          }
        }
      }
    }, stryMutAct_9fa48("6314") ? [] : (stryCov_9fa48("6314"), [removing, dispatch]));
    const list = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("6315")) {
        {}
      } else {
        stryCov_9fa48("6315");

        try {
          if (stryMutAct_9fa48("6316")) {
            {}
          } else {
            stryCov_9fa48("6316");
            setStatus(stryMutAct_9fa48("6317") ? "" : (stryCov_9fa48("6317"), 'pending'));
            const response = await listing(id);
            setStatus(stryMutAct_9fa48("6318") ? "" : (stryCov_9fa48("6318"), 'resolved'));
            return response;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6319")) {
            {}
          } else {
            stryCov_9fa48("6319");
            console.log(stryMutAct_9fa48("6320") ? "" : (stryCov_9fa48("6320"), 'e'), e);
            setStatus(stryMutAct_9fa48("6321") ? "" : (stryCov_9fa48("6321"), 'rejected'));
            const error = await e.json();
            dispatch(toogleNotification(stryMutAct_9fa48("6322") ? {} : (stryCov_9fa48("6322"), {
              text: stryMutAct_9fa48("6323") ? `` : (stryCov_9fa48("6323"), `[${e.status}] ${error.message}`),
              status: stryMutAct_9fa48("6324") ? "" : (stryCov_9fa48("6324"), 'error')
            })));
            return Promise.reject(error);
          }
        }
      }
    }, stryMutAct_9fa48("6325") ? [] : (stryCov_9fa48("6325"), [listing, dispatch]));
    const edit = useCallback(async (id: string, value: string[]) => {
      if (stryMutAct_9fa48("6326")) {
        {}
      } else {
        stryCov_9fa48("6326");

        try {
          if (stryMutAct_9fa48("6327")) {
            {}
          } else {
            stryCov_9fa48("6327");
            setStatus(stryMutAct_9fa48("6328") ? "" : (stryCov_9fa48("6328"), 'pending'));
            const response = await editing(id, value);
            setStatus(stryMutAct_9fa48("6329") ? "" : (stryCov_9fa48("6329"), 'resolved'));
            return response;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6330")) {
            {}
          } else {
            stryCov_9fa48("6330");
            setStatus(stryMutAct_9fa48("6331") ? "" : (stryCov_9fa48("6331"), 'rejected'));
            const error = await e.json();
            dispatch(toogleNotification(stryMutAct_9fa48("6332") ? {} : (stryCov_9fa48("6332"), {
              text: stryMutAct_9fa48("6333") ? `` : (stryCov_9fa48("6333"), `[${e.status}] ${error.message}`),
              status: stryMutAct_9fa48("6334") ? "" : (stryCov_9fa48("6334"), 'error')
            })));
            return Promise.reject(error);
          }
        }
      }
    }, stryMutAct_9fa48("6335") ? [] : (stryCov_9fa48("6335"), [editing, dispatch]));
    return stryMutAct_9fa48("6336") ? {} : (stryCov_9fa48("6336"), {
      status,
      save,
      remove,
      list,
      edit
    });
  }
};