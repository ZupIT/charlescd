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

import defaultsDeep from 'lodash/defaultsDeep';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import { checkStatus, getAccessToken } from 'core/utils/auth';
import { getWorkspaceId } from 'core/utils/workspace';
import { getCircleId } from 'core/utils/circle';
export const headers = stryMutAct_9fa48("1490") ? {} : (stryCov_9fa48("1490"), {
  Accept: stryMutAct_9fa48("1491") ? "" : (stryCov_9fa48("1491"), 'application/json'),
  'Content-Type': stryMutAct_9fa48("1492") ? "" : (stryCov_9fa48("1492"), 'application/json')
});
export const buildHeaders = stryMutAct_9fa48("1493") ? () => undefined : (stryCov_9fa48("1493"), (() => {
  const buildHeaders = (isFormData = stryMutAct_9fa48("1494") ? true : (stryCov_9fa48("1494"), false), circleId: string | undefined) => stryMutAct_9fa48("1495") ? {} : (stryCov_9fa48("1495"), {
    Authorization: stryMutAct_9fa48("1496") ? `` : (stryCov_9fa48("1496"), `Bearer ${getAccessToken()}`),
    'x-workspace-id': getWorkspaceId(),
    ...(stryMutAct_9fa48("1499") ? circleId || {
      'x-circle-id': circleId
    } : stryMutAct_9fa48("1498") ? false : stryMutAct_9fa48("1497") ? true : (stryCov_9fa48("1497", "1498", "1499"), circleId && (stryMutAct_9fa48("1500") ? {} : (stryCov_9fa48("1500"), {
      'x-circle-id': circleId
    })))),
    ...(stryMutAct_9fa48("1503") ? !isFormData || {
      'Content-Type': 'application/json'
    } : stryMutAct_9fa48("1502") ? false : stryMutAct_9fa48("1501") ? true : (stryCov_9fa48("1501", "1502", "1503"), (stryMutAct_9fa48("1504") ? isFormData : (stryCov_9fa48("1504"), !isFormData)) && (stryMutAct_9fa48("1505") ? {} : (stryCov_9fa48("1505"), {
      'Content-Type': stryMutAct_9fa48("1506") ? "" : (stryCov_9fa48("1506"), 'application/json')
    }))))
  });

  return buildHeaders;
})());
export interface EnvVariables {
  REACT_APP_API_URI: string;
  REACT_APP_AUTH_URI: string;
  REACT_APP_AUTH_REALM: string;
  REACT_APP_AUTH_CLIENT_ID: string;
  REACT_APP_IDM_LOGIN_URI?: string;
  REACT_APP_IDM_LOGOUT_URI?: string;
  REACT_APP_IDM_REDIRECT_URI?: string;
  REACT_APP_IDM: string;
  REACT_APP_WORKSPACE_ID?: string;
  REACT_APP_MOCK?: string;
  REACT_APP_CHARLES_VERSION: string;
}
type GlobalApexCharts = {
  exec: Function;
};
declare global {
  interface Window {
    CHARLESCD_ENVIRONMENT: EnvVariables;
    ApexCharts: GlobalApexCharts;
  }
}
export const basePath = stryMutAct_9fa48("1507") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_API_URI : (stryCov_9fa48("1507"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_API_URI);
export const authPath = stryMutAct_9fa48("1508") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_AUTH_URI : (stryCov_9fa48("1508"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_URI);
export const charlesVersion = stryMutAct_9fa48("1509") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_CHARLES_VERSION : (stryCov_9fa48("1509"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_CHARLES_VERSION);
export const authRequest = (url: string, body: object | string | undefined = undefined, options?: RequestInit): ((options: RequestInit) => Promise<Response>) => {
  if (stryMutAct_9fa48("1510")) {
    {}
  } else {
    stryCov_9fa48("1510");
    const defaultOptions = stryMutAct_9fa48("1511") ? {} : (stryCov_9fa48("1511"), {
      body: isString(body) ? body : JSON.stringify(body)
    });
    const mergedOptions = defaultsDeep(options, defaultOptions);
    return stryMutAct_9fa48("1512") ? () => undefined : (stryCov_9fa48("1512"), (options?: RequestInit) => fetch(stryMutAct_9fa48("1513") ? `` : (stryCov_9fa48("1513"), `${authPath}${url}`), defaultsDeep(mergedOptions, options)).then((response: Response) => {
      if (stryMutAct_9fa48("1514")) {
        {}
      } else {
        stryCov_9fa48("1514");

        if (stryMutAct_9fa48("1517") ? false : stryMutAct_9fa48("1516") ? true : stryMutAct_9fa48("1515") ? response.ok : (stryCov_9fa48("1515", "1516", "1517"), !response.ok)) {
          if (stryMutAct_9fa48("1518")) {
            {}
          } else {
            stryCov_9fa48("1518");
            return Promise.reject(response);
          }
        } else {
          if (stryMutAct_9fa48("1519")) {
            {}
          } else {
            stryCov_9fa48("1519");
            return response;
          }
        }
      }
    }));
  }
};
export const unauthenticatedRequest = (url: string, body: object | string | undefined = undefined, options?: RequestInit): ((options: RequestInit) => Promise<Response>) => {
  if (stryMutAct_9fa48("1520")) {
    {}
  } else {
    stryCov_9fa48("1520");
    const defaultOptions = stryMutAct_9fa48("1521") ? {} : (stryCov_9fa48("1521"), {
      headers,
      body: isString(body) ? body : JSON.stringify(body)
    });
    const mergedOptions = defaultsDeep(options, defaultOptions);
    return stryMutAct_9fa48("1522") ? () => undefined : (stryCov_9fa48("1522"), (options?: RequestInit) => fetch(stryMutAct_9fa48("1523") ? `` : (stryCov_9fa48("1523"), `${basePath}${url}`), defaultsDeep(mergedOptions, options)).then((response: Response) => {
      if (stryMutAct_9fa48("1524")) {
        {}
      } else {
        stryCov_9fa48("1524");

        if (stryMutAct_9fa48("1527") ? false : stryMutAct_9fa48("1526") ? true : stryMutAct_9fa48("1525") ? response.ok : (stryCov_9fa48("1525", "1526", "1527"), !response.ok)) {
          if (stryMutAct_9fa48("1528")) {
            {}
          } else {
            stryCov_9fa48("1528");
            return Promise.reject(response);
          }
        } else {
          if (stryMutAct_9fa48("1529")) {
            {}
          } else {
            stryCov_9fa48("1529");
            return response;
          }
        }
      }
    }));
  }
};

const buildBody = (body: object | string | undefined = undefined, isFormData: boolean) => {
  if (stryMutAct_9fa48("1530")) {
    {}
  } else {
    stryCov_9fa48("1530");
    return (stryMutAct_9fa48("1533") ? isString(body) && isFormData : stryMutAct_9fa48("1532") ? false : stryMutAct_9fa48("1531") ? true : (stryCov_9fa48("1531", "1532", "1533"), isString(body) || isFormData)) ? body : JSON.stringify(body);
  }
};

export const baseRequest = (url: string, body: object | string | undefined = undefined, options?: RequestInit): ((options: RequestInit) => Promise<Response>) => {
  if (stryMutAct_9fa48("1534")) {
    {}
  } else {
    stryCov_9fa48("1534");
    const isFormData = body instanceof FormData;
    const defaultOptions = stryMutAct_9fa48("1535") ? {} : (stryCov_9fa48("1535"), {
      headers: buildHeaders(isFormData, getCircleId()),
      body: buildBody(body, isFormData)
    });
    const mergedOptions = defaultsDeep(options, defaultOptions);
    return stryMutAct_9fa48("1536") ? () => undefined : (stryCov_9fa48("1536"), (options?: RequestInit) => fetch(stryMutAct_9fa48("1537") ? `` : (stryCov_9fa48("1537"), `${basePath}${url}`), defaultsDeep(mergedOptions, options)).then((response: Response) => {
      if (stryMutAct_9fa48("1538")) {
        {}
      } else {
        stryCov_9fa48("1538");

        if (stryMutAct_9fa48("1541") ? false : stryMutAct_9fa48("1540") ? true : stryMutAct_9fa48("1539") ? response.ok : (stryCov_9fa48("1539", "1540", "1541"), !response.ok)) {
          if (stryMutAct_9fa48("1542")) {
            {}
          } else {
            stryCov_9fa48("1542");
            checkStatus(response.status);
            return Promise.reject(response);
          }
        } else {
          if (stryMutAct_9fa48("1543")) {
            {}
          } else {
            stryCov_9fa48("1543");
            return response;
          }
        }
      }
    }));
  }
};
export const postRequest = (url: string, body: object | string | undefined = undefined): ((options: RequestInit) => Promise<Response>) => {
  if (stryMutAct_9fa48("1544")) {
    {}
  } else {
    stryCov_9fa48("1544");
    return baseRequest(url, body, stryMutAct_9fa48("1545") ? {} : (stryCov_9fa48("1545"), {
      method: stryMutAct_9fa48("1546") ? "" : (stryCov_9fa48("1546"), 'POST')
    }));
  }
};
export const putRequest = (url: string, body: object | string | undefined = undefined): ((options: RequestInit) => Promise<Response>) => {
  if (stryMutAct_9fa48("1547")) {
    {}
  } else {
    stryCov_9fa48("1547");
    return baseRequest(url, body, stryMutAct_9fa48("1548") ? {} : (stryCov_9fa48("1548"), {
      method: stryMutAct_9fa48("1549") ? "" : (stryCov_9fa48("1549"), 'PUT')
    }));
  }
};
export const deleteRequest = (url: string): ((options: RequestInit) => Promise<Response>) => {
  if (stryMutAct_9fa48("1550")) {
    {}
  } else {
    stryCov_9fa48("1550");
    return baseRequest(url, null, stryMutAct_9fa48("1551") ? {} : (stryCov_9fa48("1551"), {
      method: stryMutAct_9fa48("1552") ? "" : (stryCov_9fa48("1552"), 'DELETE')
    }));
  }
};
export const patchRequest = (url: string, opType: string, path: string, value?: string | string[]): ((options: RequestInit) => Promise<Response>) => {
  if (stryMutAct_9fa48("1553")) {
    {}
  } else {
    stryCov_9fa48("1553");
    const patches = isUndefined(value) ? stryMutAct_9fa48("1554") ? [] : (stryCov_9fa48("1554"), [stryMutAct_9fa48("1555") ? {} : (stryCov_9fa48("1555"), {
      op: opType,
      path
    })]) : stryMutAct_9fa48("1556") ? [] : (stryCov_9fa48("1556"), [stryMutAct_9fa48("1557") ? {} : (stryCov_9fa48("1557"), {
      op: opType,
      path,
      value
    })]);
    return baseRequest(url, stryMutAct_9fa48("1558") ? {} : (stryCov_9fa48("1558"), {
      patches
    }), stryMutAct_9fa48("1559") ? {} : (stryCov_9fa48("1559"), {
      method: stryMutAct_9fa48("1560") ? "" : (stryCov_9fa48("1560"), 'PATCH')
    }));
  }
};