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

export const WizardItems = stryMutAct_9fa48("954") ? [] : (stryCov_9fa48("954"), [stryMutAct_9fa48("955") ? {} : (stryCov_9fa48("955"), {
  icon: stryMutAct_9fa48("956") ? "" : (stryCov_9fa48("956"), 'empty-workspaces'),
  name: stryMutAct_9fa48("957") ? "" : (stryCov_9fa48("957"), 'welcome'),
  menu: stryMutAct_9fa48("958") ? "" : (stryCov_9fa48("958"), 'Welcome'),
  title: stryMutAct_9fa48("959") ? "" : (stryCov_9fa48("959"), 'Welcome!'),
  backgroundColor: stryMutAct_9fa48("960") ? "" : (stryCov_9fa48("960"), 'welcome'),
  size: stryMutAct_9fa48("961") ? "" : (stryCov_9fa48("961"), '190px'),
  subtitle: stryMutAct_9fa48("962") ? "" : (stryCov_9fa48("962"), 'To start using the workspace it is necessary to make some configurations. Click next and see the credentials we need to get started.')
}), stryMutAct_9fa48("963") ? {} : (stryCov_9fa48("963"), {
  icon: stryMutAct_9fa48("964") ? "" : (stryCov_9fa48("964"), 'empty-groups'),
  name: stryMutAct_9fa48("965") ? "" : (stryCov_9fa48("965"), 'user-group'),
  menu: stryMutAct_9fa48("966") ? "" : (stryCov_9fa48("966"), 'User group'),
  title: stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), 'User group'),
  backgroundColor: stryMutAct_9fa48("968") ? "" : (stryCov_9fa48("968"), 'userGroup'),
  size: stryMutAct_9fa48("969") ? "" : (stryCov_9fa48("969"), '200px'),
  subtitle: stryMutAct_9fa48("970") ? "" : (stryCov_9fa48("970"), 'You can link one or more groups to a workspace. When linking a group you will be asked what permissions it will have on this workspace.')
}), stryMutAct_9fa48("971") ? {} : (stryCov_9fa48("971"), {
  icon: stryMutAct_9fa48("972") ? "" : (stryCov_9fa48("972"), 'empty-modules'),
  name: stryMutAct_9fa48("973") ? "" : (stryCov_9fa48("973"), 'registry'),
  menu: stryMutAct_9fa48("974") ? "" : (stryCov_9fa48("974"), 'Registry'),
  title: stryMutAct_9fa48("975") ? "" : (stryCov_9fa48("975"), 'Registry'),
  backgroundColor: stryMutAct_9fa48("976") ? "" : (stryCov_9fa48("976"), 'registry'),
  size: stryMutAct_9fa48("977") ? "" : (stryCov_9fa48("977"), '177px'),
  subtitle: stryMutAct_9fa48("978") ? "" : (stryCov_9fa48("978"), 'Adding your Docker Registry allows Charles to watch for new images being generated and list all the images saved in your registry in order to deploy them. ')
}), stryMutAct_9fa48("979") ? {} : (stryCov_9fa48("979"), {
  icon: stryMutAct_9fa48("980") ? "" : (stryCov_9fa48("980"), 'empty-circles'),
  name: stryMutAct_9fa48("981") ? "" : (stryCov_9fa48("981"), 'cdConfig'),
  menu: stryMutAct_9fa48("982") ? "" : (stryCov_9fa48("982"), 'Deployment configuration'),
  title: stryMutAct_9fa48("983") ? "" : (stryCov_9fa48("983"), 'Deployment configuration'),
  backgroundColor: stryMutAct_9fa48("984") ? "" : (stryCov_9fa48("984"), 'cdConfig'),
  size: stryMutAct_9fa48("985") ? "" : (stryCov_9fa48("985"), '220px'),
  subtitle: stryMutAct_9fa48("986") ? "" : (stryCov_9fa48("986"), 'Add your Continuous Deployment (CD) tool allows Charles to deploy artifacts and manage resources inside your Kubernetes cluster.')
}), stryMutAct_9fa48("987") ? {} : (stryCov_9fa48("987"), {
  icon: stryMutAct_9fa48("988") ? "" : (stryCov_9fa48("988"), 'wizard-circle-matcher'),
  name: stryMutAct_9fa48("989") ? "" : (stryCov_9fa48("989"), 'circle-matcher'),
  menu: stryMutAct_9fa48("990") ? "" : (stryCov_9fa48("990"), 'Circle matcher'),
  title: stryMutAct_9fa48("991") ? "" : (stryCov_9fa48("991"), 'Circle matcher'),
  backgroundColor: stryMutAct_9fa48("992") ? "" : (stryCov_9fa48("992"), 'circleMatcher'),
  size: stryMutAct_9fa48("993") ? "" : (stryCov_9fa48("993"), '200px'),
  subtitle: stryMutAct_9fa48("994") ? "" : (stryCov_9fa48("994"), 'Adding URL of our tool helps Charles to identify the user since this can vary from workspace to another. ')
}), stryMutAct_9fa48("995") ? {} : (stryCov_9fa48("995"), {
  icon: stryMutAct_9fa48("996") ? "" : (stryCov_9fa48("996"), 'wizard-metrics'),
  name: stryMutAct_9fa48("997") ? "" : (stryCov_9fa48("997"), 'metrics-provider'),
  menu: stryMutAct_9fa48("998") ? "" : (stryCov_9fa48("998"), 'Metrics provider'),
  title: stryMutAct_9fa48("999") ? "" : (stryCov_9fa48("999"), 'Metrics provider'),
  backgroundColor: stryMutAct_9fa48("1000") ? "" : (stryCov_9fa48("1000"), 'metricsProvider'),
  size: stryMutAct_9fa48("1001") ? "" : (stryCov_9fa48("1001"), '190px'),
  subtitle: stryMutAct_9fa48("1002") ? "" : (stryCov_9fa48("1002"), 'Adding the URL of our tool helps Charles to metrics generation since this can vary from workspace to another.')
})]);