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

import { OptionTypeBase } from 'react-select';
import map from 'lodash/map';
import { conditionOptions, operatorsOptions } from './constants';
import { Option } from 'core/components/Form/Select/interfaces';
import { getWorkspaceId } from 'core/utils/workspace';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import filter from 'lodash/filter';
import { ActionForm } from './AddAction';
import { MetricsGroup, ChartDataByQuery, Data, ChartData, ActionType } from './types';
export const normalizeMetricOptions = stryMutAct_9fa48("3174") ? () => undefined : (stryCov_9fa48("3174"), (() => {
  const normalizeMetricOptions = (metrics: string[]) => map(metrics, stryMutAct_9fa48("3175") ? () => undefined : (stryCov_9fa48("3175"), item => stryMutAct_9fa48("3176") ? {} : (stryCov_9fa48("3176"), {
    label: item,
    value: item
  })));

  return normalizeMetricOptions;
})());
export const getCondition = stryMutAct_9fa48("3177") ? () => undefined : (stryCov_9fa48("3177"), (() => {
  const getCondition = (condition: string) => conditionOptions.find(stryMutAct_9fa48("3178") ? () => undefined : (stryCov_9fa48("3178"), ({
    value
  }) => stryMutAct_9fa48("3181") ? condition !== value : stryMutAct_9fa48("3180") ? false : stryMutAct_9fa48("3179") ? true : (stryCov_9fa48("3179", "3180", "3181"), condition === value)));

  return getCondition;
})());
export const getOperator = stryMutAct_9fa48("3182") ? () => undefined : (stryCov_9fa48("3182"), (() => {
  const getOperator = (operator: string) => operatorsOptions.find(stryMutAct_9fa48("3183") ? () => undefined : (stryCov_9fa48("3183"), ({
    value
  }) => stryMutAct_9fa48("3186") ? operator !== value : stryMutAct_9fa48("3185") ? false : stryMutAct_9fa48("3184") ? true : (stryCov_9fa48("3184", "3185", "3186"), operator === value)));

  return getOperator;
})());
export const getSelectDefaultValue = stryMutAct_9fa48("3187") ? () => undefined : (stryCov_9fa48("3187"), (() => {
  const getSelectDefaultValue = (id: string, options: Option[]) => find(options, stryMutAct_9fa48("3188") ? {} : (stryCov_9fa48("3188"), {
    value: id
  }));

  return getSelectDefaultValue;
})());
export const getThresholdStatus = (status: string) => {
  if (stryMutAct_9fa48("3189")) {
    {}
  } else {
    stryCov_9fa48("3189");

    switch (status) {
      case stryMutAct_9fa48("3191") ? "" : (stryCov_9fa48("3191"), 'REACHED'):
        if (stryMutAct_9fa48("3190")) {} else {
          stryCov_9fa48("3190");
          {
            if (stryMutAct_9fa48("3192")) {
              {}
            } else {
              stryCov_9fa48("3192");
              return stryMutAct_9fa48("3193") ? {} : (stryCov_9fa48("3193"), {
                icon: stryMutAct_9fa48("3194") ? "" : (stryCov_9fa48("3194"), 'bell'),
                color: stryMutAct_9fa48("3195") ? "" : (stryCov_9fa48("3195"), 'reached'),
                message: stryMutAct_9fa48("3196") ? "" : (stryCov_9fa48("3196"), 'This metric has reached its goal.'),
                ResumeMessage: stryMutAct_9fa48("3197") ? "" : (stryCov_9fa48("3197"), 'This metrics group has reached its goal.')
              });
            }
          }
        }

      case stryMutAct_9fa48("3199") ? "" : (stryCov_9fa48("3199"), 'ERROR'):
        if (stryMutAct_9fa48("3198")) {} else {
          stryCov_9fa48("3198");
          {
            if (stryMutAct_9fa48("3200")) {
              {}
            } else {
              stryCov_9fa48("3200");
              return stryMutAct_9fa48("3201") ? {} : (stryCov_9fa48("3201"), {
                icon: stryMutAct_9fa48("3202") ? "" : (stryCov_9fa48("3202"), 'error'),
                color: stryMutAct_9fa48("3203") ? "" : (stryCov_9fa48("3203"), 'error'),
                message: stryMutAct_9fa48("3204") ? "" : (stryCov_9fa48("3204"), 'An error occurred in this metric.'),
                ResumeMessage: stryMutAct_9fa48("3205") ? "" : (stryCov_9fa48("3205"), 'There is at least one error in your metrics group.')
              });
            }
          }
        }

      default:
        if (stryMutAct_9fa48("3206")) {} else {
          stryCov_9fa48("3206");
          {
            if (stryMutAct_9fa48("3207")) {
              {}
            } else {
              stryCov_9fa48("3207");
              return stryMutAct_9fa48("3208") ? {} : (stryCov_9fa48("3208"), {
                icon: stryMutAct_9fa48("3209") ? "" : (stryCov_9fa48("3209"), 'bell'),
                color: stryMutAct_9fa48("3210") ? "" : (stryCov_9fa48("3210"), 'active'),
                message: stryMutAct_9fa48("3211") ? "" : (stryCov_9fa48("3211"), 'This metric has not yet reached its goal.'),
                ResumeMessage: stryMutAct_9fa48("3212") ? "" : (stryCov_9fa48("3212"), 'This metrics group has not yet reached its goal.')
              });
            }
          }
        }

    }
  }
};
const buildSeriesData = stryMutAct_9fa48("3213") ? () => undefined : (stryCov_9fa48("3213"), (() => {
  const buildSeriesData = (data: Data[]) => map(data, stryMutAct_9fa48("3214") ? () => undefined : (stryCov_9fa48("3214"), item => stryMutAct_9fa48("3215") ? {} : (stryCov_9fa48("3215"), {
    x: stryMutAct_9fa48("3216") ? item.period / 1000 : (stryCov_9fa48("3216"), item.period * 1000),
    y: item.total
  })));

  return buildSeriesData;
})());
export const getMetricSeries = stryMutAct_9fa48("3217") ? () => undefined : (stryCov_9fa48("3217"), (() => {
  const getMetricSeries = (data: ChartDataByQuery) => map(data, stryMutAct_9fa48("3218") ? () => undefined : (stryCov_9fa48("3218"), item => stryMutAct_9fa48("3219") ? {} : (stryCov_9fa48("3219"), {
    name: item.metric,
    data: buildSeriesData(item.result)
  })));

  return getMetricSeries;
})());
export const filterMetricsSeries = (data: ChartData[], selectFilters: OptionTypeBase[]) => {
  if (stryMutAct_9fa48("3220")) {
    {}
  } else {
    stryCov_9fa48("3220");

    if (stryMutAct_9fa48("3223") ? isUndefined(selectFilters) && selectFilters[0]?.value === '*' : stryMutAct_9fa48("3222") ? false : stryMutAct_9fa48("3221") ? true : (stryCov_9fa48("3221", "3222", "3223"), isUndefined(selectFilters) || (stryMutAct_9fa48("3226") ? selectFilters[0]?.value !== '*' : stryMutAct_9fa48("3225") ? false : stryMutAct_9fa48("3224") ? true : (stryCov_9fa48("3224", "3225", "3226"), (stryMutAct_9fa48("3227") ? selectFilters[0].value : (stryCov_9fa48("3227"), selectFilters[0]?.value)) === (stryMutAct_9fa48("3228") ? "" : (stryCov_9fa48("3228"), '*')))))) {
      if (stryMutAct_9fa48("3229")) {
        {}
      } else {
        stryCov_9fa48("3229");
        return data;
      }
    }

    const filteredData = filter(data, item => {
      if (stryMutAct_9fa48("3230")) {
        {}
      } else {
        stryCov_9fa48("3230");
        return find(selectFilters, stryMutAct_9fa48("3231") ? () => undefined : (stryCov_9fa48("3231"), (filterItem: OptionTypeBase) => stryMutAct_9fa48("3234") ? filterItem.label !== item.name : stryMutAct_9fa48("3233") ? false : stryMutAct_9fa48("3232") ? true : (stryCov_9fa48("3232", "3233", "3234"), filterItem.label === item.name)));
      }
    });
    return (filteredData as ChartData[]);
  }
};
export const createCirclePromotionPayload = (data: ActionForm, circleId: string) => {
  if (stryMutAct_9fa48("3235")) {
    {}
  } else {
    stryCov_9fa48("3235");
    return stryMutAct_9fa48("3236") ? {} : (stryCov_9fa48("3236"), {
      destinationCircleId: data.circleId,
      originCircleId: circleId,
      workspaceId: getWorkspaceId()
    });
  }
};
export const createActionPayload = (data: ActionForm, metricsGroup: MetricsGroup, circleId: string, selectedAction: string) => {
  if (stryMutAct_9fa48("3237")) {
    {}
  } else {
    stryCov_9fa48("3237");
    const {
      actionId,
      nickname
    } = data;
    const payloadByAction = ({
      circledeployment: () => createCirclePromotionPayload(data, circleId),
      circleundeployment: () => createCirclePromotionPayload(data, circleId)
    } as Record<string, Function>);
    return stryMutAct_9fa48("3238") ? {} : (stryCov_9fa48("3238"), {
      metricsGroupId: metricsGroup.id,
      actionId,
      nickname,
      executionParameters: payloadByAction[selectedAction]()
    });
  }
};
export const normalizeActionsOptions = (actionsType: ActionType[]) => {
  if (stryMutAct_9fa48("3239")) {
    {}
  } else {
    stryCov_9fa48("3239");
    return map(actionsType, stryMutAct_9fa48("3240") ? () => undefined : (stryCov_9fa48("3240"), actionType => stryMutAct_9fa48("3241") ? {} : (stryCov_9fa48("3241"), { ...actionType,
      value: actionType.id,
      label: actionType.nickname,
      description: actionType.description
    })));
  }
};