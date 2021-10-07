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

import { Datasource, Plugin } from "../interfaces";
export const Datasources: Datasource[] = stryMutAct_9fa48("5874") ? [] : (stryCov_9fa48("5874"), [stryMutAct_9fa48("5875") ? {} : (stryCov_9fa48("5875"), {
  id: stryMutAct_9fa48("5876") ? "" : (stryCov_9fa48("5876"), 'prometheus'),
  name: stryMutAct_9fa48("5877") ? "" : (stryCov_9fa48("5877"), 'Prometheus'),
  pluginSrc: stryMutAct_9fa48("5878") ? "" : (stryCov_9fa48("5878"), 'datasource/prometheus/prometheus'),
  healthy: stryMutAct_9fa48("5879") ? false : (stryCov_9fa48("5879"), true),
  data: {}
})]);
export const Plugins: Plugin[] = stryMutAct_9fa48("5880") ? [] : (stryCov_9fa48("5880"), [stryMutAct_9fa48("5881") ? {} : (stryCov_9fa48("5881"), {
  name: stryMutAct_9fa48("5882") ? "" : (stryCov_9fa48("5882"), "Prometheus"),
  id: stryMutAct_9fa48("5883") ? "" : (stryCov_9fa48("5883"), "prometheus"),
  description: stryMutAct_9fa48("5884") ? "" : (stryCov_9fa48("5884"), "My prometheus"),
  src: stryMutAct_9fa48("5885") ? "" : (stryCov_9fa48("5885"), "datasource/prometheus/prometheus"),
  inputParameters: stryMutAct_9fa48("5886") ? {} : (stryCov_9fa48("5886"), {
    health: stryMutAct_9fa48("5887") ? false : (stryCov_9fa48("5887"), true),
    configurationInputs: stryMutAct_9fa48("5888") ? [] : (stryCov_9fa48("5888"), [stryMutAct_9fa48("5889") ? {} : (stryCov_9fa48("5889"), {
      name: stryMutAct_9fa48("5890") ? "" : (stryCov_9fa48("5890"), "url"),
      label: stryMutAct_9fa48("5891") ? "" : (stryCov_9fa48("5891"), "Url"),
      type: stryMutAct_9fa48("5892") ? "" : (stryCov_9fa48("5892"), "text"),
      required: stryMutAct_9fa48("5893") ? false : (stryCov_9fa48("5893"), true)
    })])
  })
}), stryMutAct_9fa48("5894") ? {} : (stryCov_9fa48("5894"), {
  name: stryMutAct_9fa48("5895") ? "" : (stryCov_9fa48("5895"), "Google Analytics"),
  id: stryMutAct_9fa48("5896") ? "" : (stryCov_9fa48("5896"), "googleanalytics"),
  description: stryMutAct_9fa48("5897") ? "" : (stryCov_9fa48("5897"), "My google analytics"),
  src: stryMutAct_9fa48("5898") ? "" : (stryCov_9fa48("5898"), "datasource/googleanalytics/googleanalytics"),
  inputParameters: stryMutAct_9fa48("5899") ? {} : (stryCov_9fa48("5899"), {
    configurationInputs: stryMutAct_9fa48("5900") ? [] : (stryCov_9fa48("5900"), [stryMutAct_9fa48("5901") ? {} : (stryCov_9fa48("5901"), {
      name: stryMutAct_9fa48("5902") ? "" : (stryCov_9fa48("5902"), "viewId"),
      label: stryMutAct_9fa48("5903") ? "" : (stryCov_9fa48("5903"), "View ID"),
      type: stryMutAct_9fa48("5904") ? "" : (stryCov_9fa48("5904"), "text"),
      required: stryMutAct_9fa48("5905") ? false : (stryCov_9fa48("5905"), true)
    }), stryMutAct_9fa48("5906") ? {} : (stryCov_9fa48("5906"), {
      name: stryMutAct_9fa48("5907") ? "" : (stryCov_9fa48("5907"), "serviceAccount"),
      label: stryMutAct_9fa48("5908") ? "" : (stryCov_9fa48("5908"), "Service Account"),
      type: stryMutAct_9fa48("5909") ? "" : (stryCov_9fa48("5909"), "textarea"),
      required: stryMutAct_9fa48("5910") ? false : (stryCov_9fa48("5910"), true)
    })])
  })
})]);