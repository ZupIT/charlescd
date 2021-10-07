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

import { useState, useCallback } from 'react';
import { useFetchData, useFetchStatus } from 'core/providers/base/hooks';
import { HTTP_STATUS } from 'core/enums/HttpStatus';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { getAllActions, deleteActionById, getPluginsByCategory, createAction as createActionRequest } from 'core/providers/actions';
import { useDispatch } from 'core/state/hooks';
import { Action, PluginsPayload, ActionPayload } from './types';
import { ValidationError } from 'core/interfaces/ValidationError';
export const useActionData = () => {
  if (stryMutAct_9fa48("5801")) {
    {}
  } else {
    stryCov_9fa48("5801");
    const getActionsData = useFetchData<Action[]>(getAllActions);
    const [actionResponse, setActionResponse] = useState(stryMutAct_9fa48("5802") ? ["Stryker was here"] : (stryCov_9fa48("5802"), []));
    const status = useFetchStatus();
    const getActionData = useCallback(async () => {
      if (stryMutAct_9fa48("5803")) {
        {}
      } else {
        stryCov_9fa48("5803");

        try {
          if (stryMutAct_9fa48("5804")) {
            {}
          } else {
            stryCov_9fa48("5804");
            status.pending();
            const actionResponseData = await getActionsData();
            setActionResponse(actionResponseData);
            status.resolved();
            return actionResponseData;
          }
        } catch (e) {
          if (stryMutAct_9fa48("5805")) {
            {}
          } else {
            stryCov_9fa48("5805");
            status.rejected();
            console.log(e);
          }
        }
      }
    }, stryMutAct_9fa48("5806") ? [] : (stryCov_9fa48("5806"), [getActionsData, status]));
    return stryMutAct_9fa48("5807") ? {} : (stryCov_9fa48("5807"), {
      getActionData,
      actionResponse,
      status
    });
  }
};
export const useDeleteAction = () => {
  if (stryMutAct_9fa48("5808")) {
    {}
  } else {
    stryCov_9fa48("5808");
    const deleteActionRequest = useFetchData<Action>(deleteActionById);
    const dispatch = useDispatch();
    const deleteAction = useCallback(async (actionId: string) => {
      if (stryMutAct_9fa48("5809")) {
        {}
      } else {
        stryCov_9fa48("5809");

        try {
          if (stryMutAct_9fa48("5810")) {
            {}
          } else {
            stryCov_9fa48("5810");
            const deleteActionResponse = await deleteActionRequest(actionId);
            dispatch(toogleNotification(stryMutAct_9fa48("5811") ? {} : (stryCov_9fa48("5811"), {
              text: stryMutAct_9fa48("5812") ? `` : (stryCov_9fa48("5812"), `Success deleting action`),
              status: stryMutAct_9fa48("5813") ? "" : (stryCov_9fa48("5813"), 'success')
            })));
            return deleteActionResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("5814")) {
            {}
          } else {
            stryCov_9fa48("5814");
            dispatch(toogleNotification(stryMutAct_9fa48("5815") ? {} : (stryCov_9fa48("5815"), {
              text: stryMutAct_9fa48("5816") ? `` : (stryCov_9fa48("5816"), `Error metric action`),
              status: stryMutAct_9fa48("5817") ? "" : (stryCov_9fa48("5817"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5818") ? [] : (stryCov_9fa48("5818"), [deleteActionRequest, dispatch]));
    return stryMutAct_9fa48("5819") ? {} : (stryCov_9fa48("5819"), {
      deleteAction
    });
  }
};
export const usePlugins = () => {
  if (stryMutAct_9fa48("5820")) {
    {}
  } else {
    stryCov_9fa48("5820");
    const getPluginsRequest = useFetchData<PluginsPayload[]>(getPluginsByCategory);
    const [plugins, setPlugins] = useState(stryMutAct_9fa48("5821") ? ["Stryker was here"] : (stryCov_9fa48("5821"), []));
    const getPlugins = useCallback(async (category: string) => {
      if (stryMutAct_9fa48("5822")) {
        {}
      } else {
        stryCov_9fa48("5822");

        try {
          if (stryMutAct_9fa48("5823")) {
            {}
          } else {
            stryCov_9fa48("5823");
            const pluginsResponse = await getPluginsRequest(category);
            setPlugins(pluginsResponse);
            return pluginsResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("5824")) {
            {}
          } else {
            stryCov_9fa48("5824");
            console.log(e);
          }
        }
      }
    }, stryMutAct_9fa48("5825") ? [] : (stryCov_9fa48("5825"), [getPluginsRequest]));
    return stryMutAct_9fa48("5826") ? {} : (stryCov_9fa48("5826"), {
      getPlugins,
      plugins
    });
  }
};
export const useCreateAction = () => {
  if (stryMutAct_9fa48("5827")) {
    {}
  } else {
    stryCov_9fa48("5827");
    const createActionPayload = useFetchData<ActionPayload>(createActionRequest);
    const status = useFetchStatus();
    const [validationError, setValidationError] = useState<ValidationError>();
    const dispatch = useDispatch();
    const createAction = useCallback(async (actionPayload: ActionPayload) => {
      if (stryMutAct_9fa48("5828")) {
        {}
      } else {
        stryCov_9fa48("5828");

        try {
          if (stryMutAct_9fa48("5829")) {
            {}
          } else {
            stryCov_9fa48("5829");
            status.pending();
            const saveActionResponse = await createActionPayload(actionPayload);
            status.resolved();
            return saveActionResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("5830")) {
            {}
          } else {
            stryCov_9fa48("5830");
            status.rejected();

            if (stryMutAct_9fa48("5833") ? e.status !== HTTP_STATUS.gatewayTimeout : stryMutAct_9fa48("5832") ? false : stryMutAct_9fa48("5831") ? true : (stryCov_9fa48("5831", "5832", "5833"), e.status === HTTP_STATUS.gatewayTimeout)) {
              if (stryMutAct_9fa48("5834")) {
                {}
              } else {
                stryCov_9fa48("5834");
                dispatch(toogleNotification(stryMutAct_9fa48("5835") ? {} : (stryCov_9fa48("5835"), {
                  text: stryMutAct_9fa48("5836") ? "" : (stryCov_9fa48("5836"), 'Gateway timeout'),
                  status: stryMutAct_9fa48("5837") ? "" : (stryCov_9fa48("5837"), 'error')
                })));
              }
            }

            e.text().then((errorMessage: string) => {
              if (stryMutAct_9fa48("5838")) {
                {}
              } else {
                stryCov_9fa48("5838");
                const parsedError = JSON.parse(errorMessage);
                setValidationError(parsedError);
                dispatch(toogleNotification(stryMutAct_9fa48("5839") ? {} : (stryCov_9fa48("5839"), {
                  text: stryMutAct_9fa48("5842") ? parsedError.errors?.[0]?.detail : stryMutAct_9fa48("5841") ? parsedError?.errors[0]?.detail : stryMutAct_9fa48("5840") ? parsedError?.errors?.[0].detail : (stryCov_9fa48("5840", "5841", "5842"), parsedError?.errors?.[0]?.detail),
                  status: stryMutAct_9fa48("5843") ? "" : (stryCov_9fa48("5843"), 'error')
                })));
              }
            });
          }
        }
      }
    }, stryMutAct_9fa48("5844") ? [] : (stryCov_9fa48("5844"), [createActionPayload, status, dispatch]));
    return stryMutAct_9fa48("5845") ? {} : (stryCov_9fa48("5845"), {
      createAction,
      status,
      validationError
    });
  }
};