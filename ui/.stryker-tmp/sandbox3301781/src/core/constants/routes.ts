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

import { isDevelopmentLegacyHost } from 'core/utils/development';
const main = stryMutAct_9fa48("1209") ? "" : (stryCov_9fa48("1209"), '/');
const v1 = isDevelopmentLegacyHost();
const auth = stryMutAct_9fa48("1210") ? `` : (stryCov_9fa48("1210"), `/auth`);
const login = stryMutAct_9fa48("1211") ? `` : (stryCov_9fa48("1211"), `${auth}/login`);
const workspaces = stryMutAct_9fa48("1212") ? `` : (stryCov_9fa48("1212"), `/workspaces`);
const tokens = stryMutAct_9fa48("1213") ? `` : (stryCov_9fa48("1213"), `/tokens`);
const tokensComparation = stryMutAct_9fa48("1214") ? `` : (stryCov_9fa48("1214"), `/tokens/compare`);
const users = stryMutAct_9fa48("1215") ? `` : (stryCov_9fa48("1215"), `/users`);
const usersComparation = stryMutAct_9fa48("1216") ? `` : (stryCov_9fa48("1216"), `/users/compare`);
const usersView = stryMutAct_9fa48("1217") ? `` : (stryCov_9fa48("1217"), `${v1}/settings/permissions/users`);
const usersCreate = stryMutAct_9fa48("1218") ? `` : (stryCov_9fa48("1218"), `/users/create`);
const workspace = stryMutAct_9fa48("1219") ? `` : (stryCov_9fa48("1219"), `/workspace`);
const circles = stryMutAct_9fa48("1220") ? `` : (stryCov_9fa48("1220"), `/circles`);
const modules = stryMutAct_9fa48("1221") ? `` : (stryCov_9fa48("1221"), `/modules`);
const modulesComparation = stryMutAct_9fa48("1222") ? `` : (stryCov_9fa48("1222"), `${modules}/compare`);
const metrics = stryMutAct_9fa48("1223") ? `` : (stryCov_9fa48("1223"), `/metrics`);
const metricsDeploys = stryMutAct_9fa48("1224") ? `` : (stryCov_9fa48("1224"), `${metrics}/deploys`);
const metricsCircles = stryMutAct_9fa48("1225") ? `` : (stryCov_9fa48("1225"), `${metrics}/circles`);
const settings = stryMutAct_9fa48("1226") ? `` : (stryCov_9fa48("1226"), `/settings`);
const credentials = stryMutAct_9fa48("1227") ? `` : (stryCov_9fa48("1227"), `${settings}/credentials`);
const groups = stryMutAct_9fa48("1228") ? `` : (stryCov_9fa48("1228"), `/groups`);
const groupsShow = stryMutAct_9fa48("1229") ? `` : (stryCov_9fa48("1229"), `${groups}/show`);
const groupsCreate = stryMutAct_9fa48("1230") ? `` : (stryCov_9fa48("1230"), `${groups}/create`);
const groupsEdit = stryMutAct_9fa48("1231") ? `` : (stryCov_9fa48("1231"), `${groups}/edit/:id`);
const account = stryMutAct_9fa48("1232") ? `` : (stryCov_9fa48("1232"), `/account`);
const accountProfile = stryMutAct_9fa48("1233") ? `` : (stryCov_9fa48("1233"), `${account}/profile`);
const error = stryMutAct_9fa48("1234") ? `` : (stryCov_9fa48("1234"), `/error`);
const error403 = stryMutAct_9fa48("1235") ? `` : (stryCov_9fa48("1235"), `${error}/403`);
const error404 = stryMutAct_9fa48("1236") ? `` : (stryCov_9fa48("1236"), `${error}/404`);
const circlesComparation = stryMutAct_9fa48("1237") ? `` : (stryCov_9fa48("1237"), `${circles}/compare`);
const circlesMetrics = stryMutAct_9fa48("1238") ? `` : (stryCov_9fa48("1238"), `${circles}/metrics`);
const circlesCreate = stryMutAct_9fa48("1239") ? `` : (stryCov_9fa48("1239"), `${v1}/dashboard/circles/add`);
const circlesEdit = stryMutAct_9fa48("1240") ? `` : (stryCov_9fa48("1240"), `${v1}/dashboard/circles/:circleId/edit`);
const workspacesComparation = stryMutAct_9fa48("1241") ? `` : (stryCov_9fa48("1241"), `${workspace}/compare`);
export default stryMutAct_9fa48("1242") ? {} : (stryCov_9fa48("1242"), {
  main,
  auth,
  login,
  error403,
  error404,
  workspace,
  workspaces,
  tokens,
  tokensComparation,
  users,
  usersComparation,
  usersView,
  usersCreate,
  groups,
  groupsShow,
  groupsCreate,
  groupsEdit,
  account,
  accountProfile,
  circles,
  circlesComparation,
  circlesMetrics,
  circlesCreate,
  circlesEdit,
  modules,
  modulesComparation,
  settings,
  credentials,
  workspacesComparation,
  metrics,
  metricsDeploys,
  metricsCircles
});