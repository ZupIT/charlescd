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

import { baseRequest, postRequest, deleteRequest } from './base';
import { Datasource, TestConnectionRequest } from 'modules/Settings/Credentials/Sections/MetricProvider/interfaces';
const endpoint = stryMutAct_9fa48("1659") ? "" : (stryCov_9fa48("1659"), '/compass/api/v1');
export const getAllPlugins = stryMutAct_9fa48("1660") ? () => undefined : (stryCov_9fa48("1660"), (() => {
  const getAllPlugins = () => baseRequest(stryMutAct_9fa48("1661") ? `` : (stryCov_9fa48("1661"), `${endpoint}/plugins?category=datasource`));

  return getAllPlugins;
})());
export const getAllDatasources = stryMutAct_9fa48("1662") ? () => undefined : (stryCov_9fa48("1662"), (() => {
  const getAllDatasources = () => baseRequest(stryMutAct_9fa48("1663") ? `` : (stryCov_9fa48("1663"), `${endpoint}/datasources`));

  return getAllDatasources;
})());
export const testDataSourceConnection = stryMutAct_9fa48("1664") ? () => undefined : (stryCov_9fa48("1664"), (() => {
  const testDataSourceConnection = (payload: TestConnectionRequest) => postRequest(stryMutAct_9fa48("1665") ? `` : (stryCov_9fa48("1665"), `${endpoint}/datasources/test-connection`), payload);

  return testDataSourceConnection;
})());
export const createDatasource = stryMutAct_9fa48("1666") ? () => undefined : (stryCov_9fa48("1666"), (() => {
  const createDatasource = (datasourcePayload: Datasource) => postRequest(stryMutAct_9fa48("1667") ? `` : (stryCov_9fa48("1667"), `${endpoint}/datasources`), datasourcePayload);

  return createDatasource;
})());
export const deleteDatasource = stryMutAct_9fa48("1668") ? () => undefined : (stryCov_9fa48("1668"), (() => {
  const deleteDatasource = (datasourceId: string) => deleteRequest(stryMutAct_9fa48("1669") ? `` : (stryCov_9fa48("1669"), `${endpoint}/datasources/${datasourceId}`));

  return deleteDatasource;
})());