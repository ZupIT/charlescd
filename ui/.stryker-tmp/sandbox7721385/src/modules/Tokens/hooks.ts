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

import { useCallback, useState } from 'react';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { findAll, findById, revoke, regenerate, create } from 'core/providers/tokens';
import { TokenPagination } from './interfaces/TokenPagination';
import { Token, TokenCreate } from './interfaces';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { useDispatch } from 'core/state/hooks';
import { clearTokens, loadedTokens } from './state/actions';
import { getMessageError } from 'core/utils/request-error';
export const useFindAll = (): {
  getTokens: Function;
  resetTokens: Function;
  status: FetchStatuses;
} => {
  if (stryMutAct_9fa48("6674")) {
    {}
  } else {
    stryCov_9fa48("6674");
    const getAll = useFetchData<TokenPagination>(findAll);
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6675") ? "" : (stryCov_9fa48("6675"), 'idle'));
    const dispatch = useDispatch();
    const resetTokens = useCallback(stryMutAct_9fa48("6676") ? () => undefined : (stryCov_9fa48("6676"), () => dispatch(clearTokens())), stryMutAct_9fa48("6677") ? [] : (stryCov_9fa48("6677"), [dispatch]));
    const getTokens = useCallback(async (name: string, page: string) => {
      if (stryMutAct_9fa48("6678")) {
        {}
      } else {
        stryCov_9fa48("6678");

        try {
          if (stryMutAct_9fa48("6679")) {
            {}
          } else {
            stryCov_9fa48("6679");
            setStatus(stryMutAct_9fa48("6680") ? "" : (stryCov_9fa48("6680"), 'pending'));
            resetTokens();
            const res = await getAll(stryMutAct_9fa48("6681") ? {} : (stryCov_9fa48("6681"), {
              name,
              page
            }));
            dispatch(loadedTokens(res));
            setStatus(stryMutAct_9fa48("6682") ? "" : (stryCov_9fa48("6682"), 'resolved'));
          }
        } catch (e) {
          if (stryMutAct_9fa48("6683")) {
            {}
          } else {
            stryCov_9fa48("6683");
            setStatus(stryMutAct_9fa48("6684") ? "" : (stryCov_9fa48("6684"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("6685") ? [] : (stryCov_9fa48("6685"), [getAll, resetTokens, dispatch]));
    return stryMutAct_9fa48("6686") ? {} : (stryCov_9fa48("6686"), {
      getTokens,
      resetTokens,
      status
    });
  }
};
export const useFind = () => {
  if (stryMutAct_9fa48("6687")) {
    {}
  } else {
    stryCov_9fa48("6687");
    const fetchData = useFetchData<Token>(findById);
    const [response, setResponse] = useState<Token>();
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6688") ? "" : (stryCov_9fa48("6688"), 'idle'));
    const getById = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("6689")) {
        {}
      } else {
        stryCov_9fa48("6689");

        try {
          if (stryMutAct_9fa48("6690")) {
            {}
          } else {
            stryCov_9fa48("6690");
            setStatus(stryMutAct_9fa48("6691") ? "" : (stryCov_9fa48("6691"), 'pending'));
            const data = await fetchData(id);
            setStatus(stryMutAct_9fa48("6692") ? "" : (stryCov_9fa48("6692"), 'resolved'));
            setResponse(data);
            return data;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6693")) {
            {}
          } else {
            stryCov_9fa48("6693");
            setStatus(stryMutAct_9fa48("6694") ? "" : (stryCov_9fa48("6694"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("6695") ? [] : (stryCov_9fa48("6695"), [fetchData]));
    return stryMutAct_9fa48("6696") ? {} : (stryCov_9fa48("6696"), {
      getById,
      response,
      status
    });
  }
};
export const useRevoke = () => {
  if (stryMutAct_9fa48("6697")) {
    {}
  } else {
    stryCov_9fa48("6697");
    const fetchData = useFetchData<Token>(revoke);
    const [response, setResponse] = useState<Token>();
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6698") ? "" : (stryCov_9fa48("6698"), 'idle'));
    const {
      getTokens
    } = useFindAll();
    const revokeById = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("6699")) {
        {}
      } else {
        stryCov_9fa48("6699");

        try {
          if (stryMutAct_9fa48("6700")) {
            {}
          } else {
            stryCov_9fa48("6700");
            setStatus(stryMutAct_9fa48("6701") ? "" : (stryCov_9fa48("6701"), 'pending'));
            const data = await fetchData(id);
            await getTokens();
            setStatus(stryMutAct_9fa48("6702") ? "" : (stryCov_9fa48("6702"), 'resolved'));
            setResponse(data);
            return data;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6703")) {
            {}
          } else {
            stryCov_9fa48("6703");
            setStatus(stryMutAct_9fa48("6704") ? "" : (stryCov_9fa48("6704"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("6705") ? [] : (stryCov_9fa48("6705"), [fetchData, getTokens]));
    return stryMutAct_9fa48("6706") ? {} : (stryCov_9fa48("6706"), {
      revokeById,
      response,
      status
    });
  }
};
type TokenRegenerated = {
  token: string;
};
export const useRegenerate = () => {
  if (stryMutAct_9fa48("6707")) {
    {}
  } else {
    stryCov_9fa48("6707");
    const fetchData = useFetchData<TokenRegenerated>(regenerate);
    const [response, setResponse] = useState<TokenRegenerated>();
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6708") ? "" : (stryCov_9fa48("6708"), 'idle'));
    const regenerateById = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("6709")) {
        {}
      } else {
        stryCov_9fa48("6709");

        try {
          if (stryMutAct_9fa48("6710")) {
            {}
          } else {
            stryCov_9fa48("6710");
            setStatus(stryMutAct_9fa48("6711") ? "" : (stryCov_9fa48("6711"), 'pending'));
            const data = await fetchData(id);
            setStatus(stryMutAct_9fa48("6712") ? "" : (stryCov_9fa48("6712"), 'resolved'));
            setResponse(data);
            return data;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6713")) {
            {}
          } else {
            stryCov_9fa48("6713");
            setStatus(stryMutAct_9fa48("6714") ? "" : (stryCov_9fa48("6714"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("6715") ? [] : (stryCov_9fa48("6715"), [fetchData]));
    return stryMutAct_9fa48("6716") ? {} : (stryCov_9fa48("6716"), {
      regenerateById,
      response,
      status
    });
  }
};
export const useSave = () => {
  if (stryMutAct_9fa48("6717")) {
    {}
  } else {
    stryCov_9fa48("6717");
    const saveToken = useFetchData<Token>(create);
    const [response, setResponse] = useState<Token>();
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6718") ? "" : (stryCov_9fa48("6718"), 'idle'));
    const {
      getTokens
    } = useFindAll();
    const dispatch = useDispatch();
    const save = useCallback(async (token: TokenCreate) => {
      if (stryMutAct_9fa48("6719")) {
        {}
      } else {
        stryCov_9fa48("6719");

        try {
          if (stryMutAct_9fa48("6720")) {
            {}
          } else {
            stryCov_9fa48("6720");
            setStatus(stryMutAct_9fa48("6721") ? "" : (stryCov_9fa48("6721"), 'pending'));
            const data = await saveToken(token);
            await getTokens();
            setStatus(stryMutAct_9fa48("6722") ? "" : (stryCov_9fa48("6722"), 'resolved'));
            setResponse(data);
            return data;
          }
        } catch (error) {
          if (stryMutAct_9fa48("6723")) {
            {}
          } else {
            stryCov_9fa48("6723");
            const message = await getMessageError(error);
            dispatch(toogleNotification(stryMutAct_9fa48("6724") ? {} : (stryCov_9fa48("6724"), {
              text: message,
              status: stryMutAct_9fa48("6725") ? "" : (stryCov_9fa48("6725"), 'error')
            })));
            setStatus(stryMutAct_9fa48("6726") ? "" : (stryCov_9fa48("6726"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("6727") ? [] : (stryCov_9fa48("6727"), [saveToken, dispatch, getTokens]));
    return stryMutAct_9fa48("6728") ? {} : (stryCov_9fa48("6728"), {
      save,
      response,
      status
    });
  }
};