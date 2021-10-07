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

import JwtDecode from 'jwt-decode';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import { clearCircleId } from './circle';
import { clearProfile } from './profile';
import { clearWorkspace, getWorkspace } from './workspace';
import { HTTP_STATUS } from 'core/enums/HttpStatus';
import { redirectTo } from './routes';
import routes from 'core/constants/routes';
import { getProfileByKey } from 'core/utils/profile';
import { ability, Actions, Subjects } from './abilities';
type AccessToken = {
  id?: string;
  name?: string;
  email?: string;
  root?: boolean;
  workspaces?: {
    id: string;
    roles: string[];
  }[];
};
export const accessTokenKey = stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), 'access-token');
export const refreshTokenKey = stryMutAct_9fa48("2011") ? "" : (stryCov_9fa48("2011"), 'refresh-token');
const IDMUrl = stryMutAct_9fa48("2012") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_AUTH_URI : (stryCov_9fa48("2012"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_URI);
const IDMRealm = stryMutAct_9fa48("2013") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_AUTH_REALM : (stryCov_9fa48("2013"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_REALM);
const IDMClient = stryMutAct_9fa48("2014") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_AUTH_CLIENT_ID : (stryCov_9fa48("2014"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_CLIENT_ID);
const IDMUrlLogin = stryMutAct_9fa48("2015") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_IDM_LOGIN_URI : (stryCov_9fa48("2015"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_IDM_LOGIN_URI);
const IDMUrlLogout = stryMutAct_9fa48("2016") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_IDM_LOGOUT_URI : (stryCov_9fa48("2016"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_IDM_LOGOUT_URI);
const IDMUrlRedirect = stryMutAct_9fa48("2017") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_IDM_REDIRECT_URI : (stryCov_9fa48("2017"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_IDM_REDIRECT_URI);
export const setAccessToken = stryMutAct_9fa48("2018") ? () => undefined : (stryCov_9fa48("2018"), (() => {
  const setAccessToken = (token: string) => localStorage.setItem(accessTokenKey, token);

  return setAccessToken;
})());
export const setRefreshToken = stryMutAct_9fa48("2019") ? () => undefined : (stryCov_9fa48("2019"), (() => {
  const setRefreshToken = (token: string) => localStorage.setItem(refreshTokenKey, token);

  return setRefreshToken;
})());
export const getAccessToken = stryMutAct_9fa48("2020") ? () => undefined : (stryCov_9fa48("2020"), (() => {
  const getAccessToken = () => localStorage.getItem(accessTokenKey);

  return getAccessToken;
})());
export const getAccessTokenDecoded = (): AccessToken => {
  if (stryMutAct_9fa48("2021")) {
    {}
  } else {
    stryCov_9fa48("2021");

    try {
      if (stryMutAct_9fa48("2022")) {
        {}
      } else {
        stryCov_9fa48("2022");
        return JwtDecode(getAccessToken());
      }
    } catch (e) {
      if (stryMutAct_9fa48("2023")) {
        {}
      } else {
        stryCov_9fa48("2023");
        return {};
      }
    }
  }
};
export const isRoot = () => {
  if (stryMutAct_9fa48("2024")) {
    {}
  } else {
    stryCov_9fa48("2024");
    const isRoot = getProfileByKey(stryMutAct_9fa48("2025") ? "" : (stryCov_9fa48("2025"), 'root'));
    return stryMutAct_9fa48("2028") ? isRoot && false : stryMutAct_9fa48("2027") ? false : stryMutAct_9fa48("2026") ? true : (stryCov_9fa48("2026", "2027", "2028"), isRoot || (stryMutAct_9fa48("2029") ? true : (stryCov_9fa48("2029"), false)));
  }
};
export const getPermissions = (): string[] => {
  if (stryMutAct_9fa48("2030")) {
    {}
  } else {
    stryCov_9fa48("2030");
    const workspace = getWorkspace();
    return stryMutAct_9fa48("2033") ? workspace?.permissions && [] : stryMutAct_9fa48("2032") ? false : stryMutAct_9fa48("2031") ? true : (stryCov_9fa48("2031", "2032", "2033"), (stryMutAct_9fa48("2034") ? workspace.permissions : (stryCov_9fa48("2034"), workspace?.permissions)) || (stryMutAct_9fa48("2035") ? ["Stryker was here"] : (stryCov_9fa48("2035"), [])));
  }
};
export const isRootRoute = stryMutAct_9fa48("2036") ? () => undefined : (stryCov_9fa48("2036"), (() => {
  const isRootRoute = (route: string) => includes(route, stryMutAct_9fa48("2037") ? "" : (stryCov_9fa48("2037"), 'root'));

  return isRootRoute;
})());
export const getRoles = (): string[] => {
  if (stryMutAct_9fa48("2038")) {
    {}
  } else {
    stryCov_9fa48("2038");
    const workspace = getWorkspace();
    return stryMutAct_9fa48("2041") ? workspace?.permissions && [] : stryMutAct_9fa48("2040") ? false : stryMutAct_9fa48("2039") ? true : (stryCov_9fa48("2039", "2040", "2041"), (stryMutAct_9fa48("2042") ? workspace.permissions : (stryCov_9fa48("2042"), workspace?.permissions)) || (stryMutAct_9fa48("2043") ? ["Stryker was here"] : (stryCov_9fa48("2043"), [])));
  }
};
export const hasPermission = (role: string) => {
  if (stryMutAct_9fa48("2044")) {
    {}
  } else {
    stryCov_9fa48("2044");
    const [subject, action] = stryMutAct_9fa48("2047") ? role.split('_') && ['', ''] : stryMutAct_9fa48("2046") ? false : stryMutAct_9fa48("2045") ? true : (stryCov_9fa48("2045", "2046", "2047"), role.split(stryMutAct_9fa48("2048") ? "" : (stryCov_9fa48("2048"), '_')) || (stryMutAct_9fa48("2049") ? [] : (stryCov_9fa48("2049"), [stryMutAct_9fa48("2050") ? "Stryker was here!" : (stryCov_9fa48("2050"), ''), stryMutAct_9fa48("2051") ? "Stryker was here!" : (stryCov_9fa48("2051"), '')])));
    const rule = ability.relevantRuleFor((action as Actions), (subject as Subjects));
    return stryMutAct_9fa48("2052") ? isEmpty(rule) : (stryCov_9fa48("2052"), !isEmpty(rule));
  }
};
export const getRefreshToken = stryMutAct_9fa48("2053") ? () => undefined : (stryCov_9fa48("2053"), (() => {
  const getRefreshToken = () => localStorage.getItem(refreshTokenKey);

  return getRefreshToken;
})());
export const isLogged = stryMutAct_9fa48("2054") ? () => undefined : (stryCov_9fa48("2054"), (() => {
  const isLogged = () => stryMutAct_9fa48("2057") ? getAccessToken() || getRefreshToken() : stryMutAct_9fa48("2056") ? false : stryMutAct_9fa48("2055") ? true : (stryCov_9fa48("2055", "2056", "2057"), getAccessToken() && getRefreshToken());

  return isLogged;
})());
export const clearSession = () => {
  if (stryMutAct_9fa48("2058")) {
    {}
  } else {
    stryCov_9fa48("2058");
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    clearCircleId();
    clearProfile();
    clearWorkspace();
  }
};
export const isIDMEnabled = (): boolean => {
  if (stryMutAct_9fa48("2059")) {
    {}
  } else {
    stryCov_9fa48("2059");
    const IDMEnabled = stryMutAct_9fa48("2060") ? window.CHARLESCD_ENVIRONMENT.REACT_APP_IDM : (stryCov_9fa48("2060"), window.CHARLESCD_ENVIRONMENT?.REACT_APP_IDM);
    return Boolean(parseInt(IDMEnabled));
  }
};
export function saveSessionData(accessToken: string, refreshToken: string) {
  if (stryMutAct_9fa48("2061")) {
    {}
  } else {
    stryCov_9fa48("2061");
    localStorage.setItem(accessTokenKey, accessToken);
    localStorage.setItem(refreshTokenKey, refreshToken);
  }
}
export const redirectToIDM = () => {
  if (stryMutAct_9fa48("2062")) {
    {}
  } else {
    stryCov_9fa48("2062");
    const params = stryMutAct_9fa48("2063") ? `` : (stryCov_9fa48("2063"), `?client_id=${IDMClient}&response_type=code&redirect_uri=${IDMUrlRedirect}`);
    const url = stryMutAct_9fa48("2064") ? `` : (stryCov_9fa48("2064"), `${IDMUrl}/auth/realms/${IDMRealm}${IDMUrlLogin}${params}`);
    clearSession();
    redirectTo(url);
  }
};
export const logout = () => {
  if (stryMutAct_9fa48("2065")) {
    {}
  } else {
    stryCov_9fa48("2065");

    if (stryMutAct_9fa48("2067") ? false : stryMutAct_9fa48("2066") ? true : (stryCov_9fa48("2066", "2067"), isIDMEnabled())) {
      if (stryMutAct_9fa48("2068")) {
        {}
      } else {
        stryCov_9fa48("2068");
        const refreshToken = getRefreshToken();
        const url = stryMutAct_9fa48("2069") ? `` : (stryCov_9fa48("2069"), `${IDMUrl}/auth/realms/${IDMRealm}${IDMUrlLogout}`);
        fetch(url, stryMutAct_9fa48("2070") ? {} : (stryCov_9fa48("2070"), {
          headers: stryMutAct_9fa48("2071") ? {} : (stryCov_9fa48("2071"), {
            'Content-Type': stryMutAct_9fa48("2072") ? "" : (stryCov_9fa48("2072"), 'application/x-www-form-urlencoded')
          }),
          body: stryMutAct_9fa48("2073") ? `` : (stryCov_9fa48("2073"), `client_id=${IDMClient}&refresh_token=${refreshToken}`),
          method: stryMutAct_9fa48("2074") ? "" : (stryCov_9fa48("2074"), 'POST')
        })).finally(() => {
          if (stryMutAct_9fa48("2075")) {
            {}
          } else {
            stryCov_9fa48("2075");
            clearSession();
            redirectTo(routes.main);
          }
        });
      }
    } else {
      if (stryMutAct_9fa48("2076")) {
        {}
      } else {
        stryCov_9fa48("2076");
        clearSession();
        redirectTo(routes.login);
      }
    }
  }
};
export const checkStatus = (status: number) => {
  if (stryMutAct_9fa48("2077")) {
    {}
  } else {
    stryCov_9fa48("2077");

    if (stryMutAct_9fa48("2080") ? status !== HTTP_STATUS.unauthorized : stryMutAct_9fa48("2079") ? false : stryMutAct_9fa48("2078") ? true : (stryCov_9fa48("2078", "2079", "2080"), status === HTTP_STATUS.unauthorized)) {
      if (stryMutAct_9fa48("2081")) {
        {}
      } else {
        stryCov_9fa48("2081");
        logout();
      }
    }
  }
};