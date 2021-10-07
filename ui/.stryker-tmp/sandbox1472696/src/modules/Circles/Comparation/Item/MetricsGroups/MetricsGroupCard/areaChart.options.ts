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

import { getTheme } from 'core/utils/themes';
const theme = getTheme();
export default stryMutAct_9fa48("2967") ? {} : (stryCov_9fa48("2967"), {
  chart: stryMutAct_9fa48("2968") ? {} : (stryCov_9fa48("2968"), {
    id: stryMutAct_9fa48("2969") ? "" : (stryCov_9fa48("2969"), 'monitoringChart'),
    background: stryMutAct_9fa48("2970") ? "" : (stryCov_9fa48("2970"), 'transparent'),
    stacked: stryMutAct_9fa48("2971") ? true : (stryCov_9fa48("2971"), false),
    zoom: stryMutAct_9fa48("2972") ? {} : (stryCov_9fa48("2972"), {
      enabled: stryMutAct_9fa48("2973") ? true : (stryCov_9fa48("2973"), false)
    })
  }),
  colors: theme.metrics.chart.Comparison,
  theme: stryMutAct_9fa48("2974") ? {} : (stryCov_9fa48("2974"), {
    mode: stryMutAct_9fa48("2975") ? "" : (stryCov_9fa48("2975"), 'dark')
  }),
  grid: stryMutAct_9fa48("2976") ? {} : (stryCov_9fa48("2976"), {
    borderColor: theme.circleGroupMetrics.chart.gridColor,
    show: stryMutAct_9fa48("2977") ? false : (stryCov_9fa48("2977"), true),
    yaxis: stryMutAct_9fa48("2978") ? {} : (stryCov_9fa48("2978"), {
      lines: stryMutAct_9fa48("2979") ? {} : (stryCov_9fa48("2979"), {
        show: stryMutAct_9fa48("2980") ? false : (stryCov_9fa48("2980"), true)
      })
    }),
    padding: stryMutAct_9fa48("2981") ? {} : (stryCov_9fa48("2981"), {
      left: 10
    })
  }),
  legend: stryMutAct_9fa48("2982") ? {} : (stryCov_9fa48("2982"), {
    show: stryMutAct_9fa48("2983") ? true : (stryCov_9fa48("2983"), false)
  }),
  xaxis: stryMutAct_9fa48("2984") ? {} : (stryCov_9fa48("2984"), {
    type: stryMutAct_9fa48("2985") ? "" : (stryCov_9fa48("2985"), 'datetime'),
    labels: stryMutAct_9fa48("2986") ? {} : (stryCov_9fa48("2986"), {
      datetimeUTC: stryMutAct_9fa48("2987") ? true : (stryCov_9fa48("2987"), false)
    })
  }),
  markers: stryMutAct_9fa48("2988") ? {} : (stryCov_9fa48("2988"), {
    size: 0.1,
    strokeColors: stryMutAct_9fa48("2989") ? "" : (stryCov_9fa48("2989"), 'transparent')
  }),
  stroke: stryMutAct_9fa48("2990") ? {} : (stryCov_9fa48("2990"), {
    curve: stryMutAct_9fa48("2991") ? "" : (stryCov_9fa48("2991"), 'smooth')
  }),
  tooltip: stryMutAct_9fa48("2992") ? {} : (stryCov_9fa48("2992"), {
    x: stryMutAct_9fa48("2993") ? {} : (stryCov_9fa48("2993"), {
      format: stryMutAct_9fa48("2994") ? "" : (stryCov_9fa48("2994"), 'dd MMM • HH:mm')
    })
  })
});