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

import { useEffect, useState, useCallback, useRef } from 'react';
import { HTTP_STATUS } from 'core/enums/HttpStatus';
import { login, renewToken } from '../auth';
import { getRefreshToken, isIDMEnabled } from 'core/utils/auth';
import { redirectTo } from 'core/utils/routes';
import routes from 'core/constants/routes';
export interface ResponseError extends Error {
  status?: number;
  code?: string;
}
interface FetchData<T> {
  response: T;
  error: Response;
  loading: boolean;
}
export interface FetchProps {
  responseAdd?: unknown;
  responseAll?: unknown;
  responseRemove?: unknown;
  responseArchive?: unknown;
  responseSave?: unknown;
  responseUpdate?: unknown;
  responseTest?: unknown;
  response?: unknown;
  loadingAdd?: boolean;
  loadingAll?: boolean;
  loadingRemove?: boolean;
  loadingSave?: boolean;
  loadingUpdate?: boolean;
  loadingTest?: boolean;
  loading?: boolean;
  test?: Function;
  errorTest?: unknown;
  getAll?: Function;
  findUserGroupByName?: Function;
  getById?: Function;
  save?: Function;
  update?: Function;
  remove?: Function;
  status?: FetchStatuses;
}
const renewTokenByCb = stryMutAct_9fa48("1398") ? () => undefined : (stryCov_9fa48("1398"), (() => {
  const renewTokenByCb = (fn: () => Promise<Response>, isLoginRequest: boolean) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn().catch(async (error: any) => {
    if (stryMutAct_9fa48("1399")) {
      {}
    } else {
      stryCov_9fa48("1399");

      if (stryMutAct_9fa48("1402") ? HTTP_STATUS.unauthorized !== error.status : stryMutAct_9fa48("1401") ? false : stryMutAct_9fa48("1400") ? true : (stryCov_9fa48("1400", "1401", "1402"), HTTP_STATUS.unauthorized === error.status)) {
        if (stryMutAct_9fa48("1403")) {
          {}
        } else {
          stryCov_9fa48("1403");

          try {
            if (stryMutAct_9fa48("1404")) {
              {}
            } else {
              stryCov_9fa48("1404");

              if (stryMutAct_9fa48("1407") ? !isLoginRequest || !isIDMEnabled() : stryMutAct_9fa48("1406") ? false : stryMutAct_9fa48("1405") ? true : (stryCov_9fa48("1405", "1406", "1407"), (stryMutAct_9fa48("1408") ? isLoginRequest : (stryCov_9fa48("1408"), !isLoginRequest)) && (stryMutAct_9fa48("1409") ? isIDMEnabled() : (stryCov_9fa48("1409"), !isIDMEnabled())))) {
                if (stryMutAct_9fa48("1410")) {
                  {}
                } else {
                  stryCov_9fa48("1410");
                  await renewToken(getRefreshToken())({});
                }
              }

              return fn();
            }
          } catch (error) {
            if (stryMutAct_9fa48("1411")) {
              {}
            } else {
              stryCov_9fa48("1411");
              redirectTo(routes.login);
              return error;
            }
          }
        }
      } else {
        if (stryMutAct_9fa48("1412")) {
          {}
        } else {
          stryCov_9fa48("1412");
          return Promise.reject(error);
        }
      }
    }
  });

  return renewTokenByCb;
})());

const getResponse = async (response: Response) => {
  if (stryMutAct_9fa48("1413")) {
    {}
  } else {
    stryCov_9fa48("1413");

    try {
      if (stryMutAct_9fa48("1414")) {
        {}
      } else {
        stryCov_9fa48("1414");
        return await response.json();
      }
    } catch (e) {
      if (stryMutAct_9fa48("1415")) {
        {}
      } else {
        stryCov_9fa48("1415");

        if (stryMutAct_9fa48("1419") ? response.status < 400 : stryMutAct_9fa48("1418") ? response.status > 400 : stryMutAct_9fa48("1417") ? false : stryMutAct_9fa48("1416") ? true : (stryCov_9fa48("1416", "1417", "1418", "1419"), response.status >= 400)) {
          if (stryMutAct_9fa48("1420")) {
            {}
          } else {
            stryCov_9fa48("1420");
            throw Error(e);
          }
        } else {
          if (stryMutAct_9fa48("1421")) {
            {}
          } else {
            stryCov_9fa48("1421");
            return response.status;
          }
        }
      }
    }
  }
};

export type FetchParams = ( // eslint-disable-next-line @typescript-eslint/no-explicit-any
...args: any) => (options: RequestInit) => Promise<Response>;
export const useFetchData = <T>(req: FetchParams): ((...args: unknown[]) => Promise<T>) => {
  if (stryMutAct_9fa48("1422")) {
    {}
  } else {
    stryCov_9fa48("1422");
    const isLoginRequest = stryMutAct_9fa48("1425") ? login !== req : stryMutAct_9fa48("1424") ? false : stryMutAct_9fa48("1423") ? true : (stryCov_9fa48("1423", "1424", "1425"), login === req);
    return useCallback(async (...args: unknown[]) => {
      if (stryMutAct_9fa48("1426")) {
        {}
      } else {
        stryCov_9fa48("1426");
        const response = await renewTokenByCb(stryMutAct_9fa48("1427") ? () => undefined : (stryCov_9fa48("1427"), () => req(...args)({})), isLoginRequest);
        const data = await getResponse(response);
        return data;
      }
    }, stryMutAct_9fa48("1428") ? [] : (stryCov_9fa48("1428"), [isLoginRequest, req]));
  }
};
export const useFetch = <T>(req: (...args: any) => (options: RequestInit) => Promise<Response>): [FetchData<T>, (...args: unknown[]) => void, (...args: unknown[]) => Promise<T>] => {
  if (stryMutAct_9fa48("1429")) {
    {}
  } else {
    stryCov_9fa48("1429");
    const [response, setResponse] = useState<T>();
    const [error, setError] = useState<Response>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("1430") ? true : (stryCov_9fa48("1430"), false));
    const mounted = useRef(stryMutAct_9fa48("1431") ? false : (stryCov_9fa48("1431"), true));
    const isLoginRequest = stryMutAct_9fa48("1434") ? login !== req : stryMutAct_9fa48("1433") ? false : stryMutAct_9fa48("1432") ? true : (stryCov_9fa48("1432", "1433", "1434"), login === req);

    const promise = async (...args: unknown[]) => {
      if (stryMutAct_9fa48("1435")) {
        {}
      } else {
        stryCov_9fa48("1435");
        setLoading(stryMutAct_9fa48("1436") ? false : (stryCov_9fa48("1436"), true));
        const response = await renewTokenByCb(stryMutAct_9fa48("1437") ? () => undefined : (stryCov_9fa48("1437"), () => req(...args)({})), isLoginRequest);
        const data = await getResponse(response);
        setLoading(stryMutAct_9fa48("1438") ? true : (stryCov_9fa48("1438"), false));
        return data;
      }
    };

    const trigger = useCallback(async (...args: unknown[]) => {
      if (stryMutAct_9fa48("1439")) {
        {}
      } else {
        stryCov_9fa48("1439");
        setLoading(stryMutAct_9fa48("1440") ? false : (stryCov_9fa48("1440"), true));

        try {
          if (stryMutAct_9fa48("1441")) {
            {}
          } else {
            stryCov_9fa48("1441");
            const response = await renewTokenByCb(stryMutAct_9fa48("1442") ? () => undefined : (stryCov_9fa48("1442"), () => req(...args)({})), isLoginRequest);
            const data = await getResponse(response);
            if (stryMutAct_9fa48("1444") ? false : stryMutAct_9fa48("1443") ? true : (stryCov_9fa48("1443", "1444"), mounted.current)) setResponse(data);
          }
        } catch (error) {
          if (stryMutAct_9fa48("1445")) {
            {}
          } else {
            stryCov_9fa48("1445");
            if (stryMutAct_9fa48("1447") ? false : stryMutAct_9fa48("1446") ? true : (stryCov_9fa48("1446", "1447"), mounted.current)) setError(error);
          }
        } finally {
          if (stryMutAct_9fa48("1448")) {
            {}
          } else {
            stryCov_9fa48("1448");
            if (stryMutAct_9fa48("1450") ? false : stryMutAct_9fa48("1449") ? true : (stryCov_9fa48("1449", "1450"), mounted.current)) setLoading(stryMutAct_9fa48("1451") ? true : (stryCov_9fa48("1451"), false));
          }
        }
      }
    }, stryMutAct_9fa48("1452") ? [] : (stryCov_9fa48("1452"), [req, mounted, isLoginRequest]));
    useEffect(() => {
      if (stryMutAct_9fa48("1453")) {
        {}
      } else {
        stryCov_9fa48("1453");
        return () => {
          if (stryMutAct_9fa48("1454")) {
            {}
          } else {
            stryCov_9fa48("1454");
            mounted.current = stryMutAct_9fa48("1455") ? true : (stryCov_9fa48("1455"), false);
          }
        };
      }
    }, stryMutAct_9fa48("1456") ? ["Stryker was here"] : (stryCov_9fa48("1456"), []));
    return stryMutAct_9fa48("1457") ? [] : (stryCov_9fa48("1457"), [stryMutAct_9fa48("1458") ? {} : (stryCov_9fa48("1458"), {
      response,
      error,
      loading
    }), trigger, promise]);
  }
};
export interface FetchStatus {
  idle: () => void;
  pending: () => void;
  resolved: () => void;
  rejected: () => void;
  isIdle: boolean;
  isPending: boolean;
  isResolved: boolean;
  isRejected: boolean;
}
export type FetchStatuses = 'idle' | 'pending' | 'resolved' | 'rejected';
export const useFetchStatus = (): FetchStatus => {
  if (stryMutAct_9fa48("1459")) {
    {}
  } else {
    stryCov_9fa48("1459");
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("1460") ? "" : (stryCov_9fa48("1460"), 'idle'));
    const idle = useCallback(stryMutAct_9fa48("1461") ? () => undefined : (stryCov_9fa48("1461"), () => setStatus(stryMutAct_9fa48("1462") ? "" : (stryCov_9fa48("1462"), 'idle'))), stryMutAct_9fa48("1463") ? ["Stryker was here"] : (stryCov_9fa48("1463"), []));
    const pending = useCallback(stryMutAct_9fa48("1464") ? () => undefined : (stryCov_9fa48("1464"), () => setStatus(stryMutAct_9fa48("1465") ? "" : (stryCov_9fa48("1465"), 'pending'))), stryMutAct_9fa48("1466") ? ["Stryker was here"] : (stryCov_9fa48("1466"), []));
    const resolved = useCallback(stryMutAct_9fa48("1467") ? () => undefined : (stryCov_9fa48("1467"), () => setStatus(stryMutAct_9fa48("1468") ? "" : (stryCov_9fa48("1468"), 'resolved'))), stryMutAct_9fa48("1469") ? ["Stryker was here"] : (stryCov_9fa48("1469"), []));
    const rejected = useCallback(stryMutAct_9fa48("1470") ? () => undefined : (stryCov_9fa48("1470"), () => setStatus(stryMutAct_9fa48("1471") ? "" : (stryCov_9fa48("1471"), 'rejected'))), stryMutAct_9fa48("1472") ? ["Stryker was here"] : (stryCov_9fa48("1472"), []));
    const isIdle = stryMutAct_9fa48("1475") ? status !== 'idle' : stryMutAct_9fa48("1474") ? false : stryMutAct_9fa48("1473") ? true : (stryCov_9fa48("1473", "1474", "1475"), status === (stryMutAct_9fa48("1476") ? "" : (stryCov_9fa48("1476"), 'idle')));
    const isPending = stryMutAct_9fa48("1479") ? status !== 'pending' : stryMutAct_9fa48("1478") ? false : stryMutAct_9fa48("1477") ? true : (stryCov_9fa48("1477", "1478", "1479"), status === (stryMutAct_9fa48("1480") ? "" : (stryCov_9fa48("1480"), 'pending')));
    const isResolved = stryMutAct_9fa48("1483") ? status !== 'resolved' : stryMutAct_9fa48("1482") ? false : stryMutAct_9fa48("1481") ? true : (stryCov_9fa48("1481", "1482", "1483"), status === (stryMutAct_9fa48("1484") ? "" : (stryCov_9fa48("1484"), 'resolved')));
    const isRejected = stryMutAct_9fa48("1487") ? status !== 'rejected' : stryMutAct_9fa48("1486") ? false : stryMutAct_9fa48("1485") ? true : (stryCov_9fa48("1485", "1486", "1487"), status === (stryMutAct_9fa48("1488") ? "" : (stryCov_9fa48("1488"), 'rejected')));
    return stryMutAct_9fa48("1489") ? {} : (stryCov_9fa48("1489"), {
      idle,
      pending,
      resolved,
      rejected,
      isIdle,
      isPending,
      isResolved,
      isRejected
    });
  }
};