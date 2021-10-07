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

import { DeployMetricData, MetricDataInPeriod } from './interfaces';
import map from 'lodash/map';
import dayjs from 'dayjs';
const buildSeriesData = stryMutAct_9fa48("5014") ? () => undefined : (stryCov_9fa48("5014"), (() => {
  const buildSeriesData = (metricData: MetricDataInPeriod[]) => map(metricData, stryMutAct_9fa48("5015") ? () => undefined : (stryCov_9fa48("5015"), item => stryMutAct_9fa48("5016") ? {} : (stryCov_9fa48("5016"), {
    x: item.period,
    y: item.total
  })));

  return buildSeriesData;
})());
export const getDeploySeries = stryMutAct_9fa48("5017") ? () => undefined : (stryCov_9fa48("5017"), (() => {
  const getDeploySeries = (data: DeployMetricData) => stryMutAct_9fa48("5018") ? [] : (stryCov_9fa48("5018"), [stryMutAct_9fa48("5019") ? {} : (stryCov_9fa48("5019"), {
    name: stryMutAct_9fa48("5020") ? "" : (stryCov_9fa48("5020"), 'Deploy'),
    type: stryMutAct_9fa48("5021") ? "" : (stryCov_9fa48("5021"), 'column'),
    data: buildSeriesData(stryMutAct_9fa48("5022") ? data.successfulDeploymentsInPeriod : (stryCov_9fa48("5022"), data?.successfulDeploymentsInPeriod))
  }), stryMutAct_9fa48("5023") ? {} : (stryCov_9fa48("5023"), {
    name: stryMutAct_9fa48("5024") ? "" : (stryCov_9fa48("5024"), 'Error'),
    type: stryMutAct_9fa48("5025") ? "" : (stryCov_9fa48("5025"), 'column'),
    data: buildSeriesData(stryMutAct_9fa48("5026") ? data.failedDeploymentsInPeriod : (stryCov_9fa48("5026"), data?.failedDeploymentsInPeriod))
  }), stryMutAct_9fa48("5027") ? {} : (stryCov_9fa48("5027"), {
    name: stryMutAct_9fa48("5028") ? "" : (stryCov_9fa48("5028"), 'Avarege time'),
    type: stryMutAct_9fa48("5029") ? "" : (stryCov_9fa48("5029"), 'area'),
    data: map(stryMutAct_9fa48("5030") ? data.deploymentsAverageTimeInPeriod : (stryCov_9fa48("5030"), data?.deploymentsAverageTimeInPeriod), stryMutAct_9fa48("5031") ? () => undefined : (stryCov_9fa48("5031"), DeploymentAverageTime => stryMutAct_9fa48("5032") ? {} : (stryCov_9fa48("5032"), {
      x: DeploymentAverageTime.period,
      y: DeploymentAverageTime.averageTime
    })))
  })]);

  return getDeploySeries;
})());
export const chartDateFormatter = (date: string) => {
  if (stryMutAct_9fa48("5033")) {
    {}
  } else {
    stryCov_9fa48("5033");
    return dayjs(date, stryMutAct_9fa48("5034") ? "" : (stryCov_9fa48("5034"), 'YYYY-MM-DD')).format(stryMutAct_9fa48("5035") ? "" : (stryCov_9fa48("5035"), 'DDMMM'));
  }
};
export const getPlotOption = (deploySeries: Array<any>) => {
  if (stryMutAct_9fa48("5036")) {
    {}
  } else {
    stryCov_9fa48("5036");
    const plotOptionsMin = stryMutAct_9fa48("5037") ? {} : (stryCov_9fa48("5037"), {
      bar: stryMutAct_9fa48("5038") ? {} : (stryCov_9fa48("5038"), {
        columnWidth: stryMutAct_9fa48("5039") ? "" : (stryCov_9fa48("5039"), '25%')
      })
    });
    const plotOptionsMax = stryMutAct_9fa48("5040") ? {} : (stryCov_9fa48("5040"), {
      bar: stryMutAct_9fa48("5041") ? {} : (stryCov_9fa48("5041"), {
        columnWidth: stryMutAct_9fa48("5042") ? "" : (stryCov_9fa48("5042"), '50%')
      })
    });
    const deploy = deploySeries[0].data[2];
    const error = deploySeries[1].data[2];
    return (stryMutAct_9fa48("5043") ? deploy || error : (stryCov_9fa48("5043"), !(stryMutAct_9fa48("5046") ? deploy && error : stryMutAct_9fa48("5045") ? false : stryMutAct_9fa48("5044") ? true : (stryCov_9fa48("5044", "5045", "5046"), deploy || error)))) ? plotOptionsMin : plotOptionsMax;
  }
};