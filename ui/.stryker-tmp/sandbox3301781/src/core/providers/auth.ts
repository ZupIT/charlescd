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

import { authRequest, unauthenticatedRequest } from './base';
const client = stryMutAct_9fa48("1367") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_AUTH_CLIENT_ID : (stryCov_9fa48("1367"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_CLIENT_ID);
const realm = stryMutAct_9fa48("1368") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_AUTH_REALM : (stryCov_9fa48("1368"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_REALM);
const redirectUri = stryMutAct_9fa48("1369") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_IDM_REDIRECT_URI : (stryCov_9fa48("1369"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_IDM_REDIRECT_URI);
const workspaceId = stryMutAct_9fa48("1372") ? window.CHARLESCD_ENVIRONMENT?.REACT_APP_WORKSPACE_ID && 'UNKNOWN' : stryMutAct_9fa48("1371") ? false : stryMutAct_9fa48("1370") ? true : (stryCov_9fa48("1370", "1371", "1372"), (stryMutAct_9fa48("1373") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_WORKSPACE_ID : (stryCov_9fa48("1373"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_WORKSPACE_ID)) || (stryMutAct_9fa48("1374") ? "" : (stryCov_9fa48("1374"), 'UNKNOWN')));
const circleMatcherEndpoint = stryMutAct_9fa48("1375") ? "" : (stryCov_9fa48("1375"), '/charlescd-circle-matcher/identify');
const endpoint = stryMutAct_9fa48("1376") ? `` : (stryCov_9fa48("1376"), `/auth/realms/${realm}/protocol/openid-connect/token`);
const headers = stryMutAct_9fa48("1377") ? {} : (stryCov_9fa48("1377"), {
  'Content-Type': stryMutAct_9fa48("1378") ? "" : (stryCov_9fa48("1378"), 'application/x-www-form-urlencoded')
});
export const login = (username: string, password: string) => {
  if (stryMutAct_9fa48("1379")) {
    {}
  } else {
    stryCov_9fa48("1379");
    const grantType = stryMutAct_9fa48("1380") ? "" : (stryCov_9fa48("1380"), 'password');
    const encodedPassword = encodeURIComponent(password);
    const data = stryMutAct_9fa48("1381") ? `` : (stryCov_9fa48("1381"), `grant_type=${grantType}&client_id=${client}&username=${username}&password=${encodedPassword}`);
    return authRequest(endpoint, data, stryMutAct_9fa48("1382") ? {} : (stryCov_9fa48("1382"), {
      method: stryMutAct_9fa48("1383") ? "" : (stryCov_9fa48("1383"), 'POST'),
      headers
    }));
  }
};
export const circleMatcher = (payload: unknown) => {
  if (stryMutAct_9fa48("1384")) {
    {}
  } else {
    stryCov_9fa48("1384");
    const data = stryMutAct_9fa48("1385") ? {} : (stryCov_9fa48("1385"), {
      requestData: payload,
      workspaceId
    });
    return unauthenticatedRequest(circleMatcherEndpoint, data, stryMutAct_9fa48("1386") ? {} : (stryCov_9fa48("1386"), {
      method: stryMutAct_9fa48("1387") ? "" : (stryCov_9fa48("1387"), 'POST')
    }));
  }
};
export const codeToTokens = (code: string) => {
  if (stryMutAct_9fa48("1388")) {
    {}
  } else {
    stryCov_9fa48("1388");
    const grantType = stryMutAct_9fa48("1389") ? "" : (stryCov_9fa48("1389"), 'authorization_code');
    const data = stryMutAct_9fa48("1390") ? `` : (stryCov_9fa48("1390"), `grant_type=${grantType}&client_id=${client}&code=${code}&redirect_uri=${redirectUri}`);
    return authRequest(endpoint, data, stryMutAct_9fa48("1391") ? {} : (stryCov_9fa48("1391"), {
      method: stryMutAct_9fa48("1392") ? "" : (stryCov_9fa48("1392"), 'POST'),
      headers
    }));
  }
};
export const renewToken = (refreshToken: string) => {
  if (stryMutAct_9fa48("1393")) {
    {}
  } else {
    stryCov_9fa48("1393");
    const grantType = stryMutAct_9fa48("1394") ? "" : (stryCov_9fa48("1394"), 'refresh_token');
    const data = stryMutAct_9fa48("1395") ? `` : (stryCov_9fa48("1395"), `grant_type=${grantType}&client_id=${client}&refresh_token=${refreshToken}`);
    return authRequest(endpoint, data, stryMutAct_9fa48("1396") ? {} : (stryCov_9fa48("1396"), {
      method: stryMutAct_9fa48("1397") ? "" : (stryCov_9fa48("1397"), 'POST'),
      headers
    }));
  }
};