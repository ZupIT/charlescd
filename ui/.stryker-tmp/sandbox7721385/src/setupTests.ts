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
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
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

import '@testing-library/jest-dom/extend-expect';
import fetch, { FetchMock } from 'jest-fetch-mock';
import storageMock from 'unit-test/local-storage';
import { mockCookie } from './unit-test/cookie';
import 'mutationobserver-shim';
import MockIntersectionObserver from 'unit-test/MockIntersectionObserver';
export const DEFAULT_TEST_BASE_URL = stryMutAct_9fa48("7191") ? "" : (stryCov_9fa48("7191"), 'http://localhost:8000');
Object.assign(window, stryMutAct_9fa48("7192") ? {} : (stryCov_9fa48("7192"), {
  CHARLESCD_ENVIRONMENT: stryMutAct_9fa48("7193") ? {} : (stryCov_9fa48("7193"), {
    REACT_APP_API_URI: DEFAULT_TEST_BASE_URL,
    REACT_APP_AUTH_URI: stryMutAct_9fa48("7194") ? `` : (stryCov_9fa48("7194"), `${DEFAULT_TEST_BASE_URL}/keycloak`),
    REACT_APP_CHARLES_VERSION: stryMutAct_9fa48("7195") ? "" : (stryCov_9fa48("7195"), '0.6.1')
  })
}));
beforeEach(() => {
  if (stryMutAct_9fa48("7196")) {
    {}
  } else {
    stryCov_9fa48("7196");
    (fetch as FetchMock).resetMocks();
  }
});
interface CustomDocument {
  cookie?: string;
}
export interface CustomGlobal {
  fetch: any;
  localStorage?: object;
  document?: CustomDocument;
  Worker: object;
}
export const originalFetch = (window.fetch as FetchMock);
declare const global: CustomGlobal;
mockCookie();

class Worker {
  addEventListener = jest.fn();
  postMessage = jest.fn();
  terminate = jest.fn();
}

global.Worker = Worker;
window.URL.createObjectURL = jest.fn();
global.fetch = (fetch as FetchMock);
global.localStorage = storageMock();
global.document.cookie = stryMutAct_9fa48("7197") ? "Stryker was here!" : (stryCov_9fa48("7197"), '');
Object.assign(navigator, stryMutAct_9fa48("7198") ? {} : (stryCov_9fa48("7198"), {
  clipboard: stryMutAct_9fa48("7199") ? {} : (stryCov_9fa48("7199"), {
    writeText: () => undefined
  })
}));
window.IntersectionObserver = MockIntersectionObserver;