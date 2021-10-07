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

import { ActionForm } from "../AddAction";
import { Metric, Action, ChartData, ActionType } from "../types";
export const metricsGroupChartData = stryMutAct_9fa48("3041") ? {} : (stryCov_9fa48("3041"), {
  id: stryMutAct_9fa48("3042") ? "" : (stryCov_9fa48("3042"), "d4b69bf8-34cd-4bf0-81c3-781202f16dd6"),
  metric: stryMutAct_9fa48("3043") ? "" : (stryCov_9fa48("3043"), "test 12"),
  result: stryMutAct_9fa48("3044") ? [] : (stryCov_9fa48("3044"), [stryMutAct_9fa48("3045") ? {} : (stryCov_9fa48("3045"), {
    total: 10,
    period: 1599074229
  })])
});
const Execution = stryMutAct_9fa48("3046") ? {} : (stryCov_9fa48("3046"), {
  lastValue: 0,
  status: stryMutAct_9fa48("3047") ? "" : (stryCov_9fa48("3047"), 'ERROR')
});
export const metricsData: Metric = stryMutAct_9fa48("3048") ? {} : (stryCov_9fa48("3048"), {
  id: stryMutAct_9fa48("3049") ? "" : (stryCov_9fa48("3049"), "1a"),
  nickname: stryMutAct_9fa48("3050") ? "" : (stryCov_9fa48("3050"), "test 1a"),
  createdAt: stryMutAct_9fa48("3051") ? "" : (stryCov_9fa48("3051"), "test"),
  metricGroupId: stryMutAct_9fa48("3052") ? "" : (stryCov_9fa48("3052"), "d4b69bf8-34cd-4bf0-81c3-781202f17fe7"),
  condition: stryMutAct_9fa48("3053") ? "" : (stryCov_9fa48("3053"), 'EQUAL'),
  threshold: 10,
  status: stryMutAct_9fa48("3054") ? "" : (stryCov_9fa48("3054"), 'ACTIVE'),
  execution: Execution,
  circleId: stryMutAct_9fa48("3055") ? "" : (stryCov_9fa48("3055"), "d4b69bf8-34cd-4bf0-81c3-781202f16dd6"),
  dataSourceId: stryMutAct_9fa48("3056") ? "" : (stryCov_9fa48("3056"), 'abc123'),
  metric: stryMutAct_9fa48("3057") ? "" : (stryCov_9fa48("3057"), 'metric xyz'),
  filters: stryMutAct_9fa48("3058") ? [] : (stryCov_9fa48("3058"), [stryMutAct_9fa48("3059") ? {} : (stryCov_9fa48("3059"), {
    id: stryMutAct_9fa48("3060") ? "" : (stryCov_9fa48("3060"), '1'),
    field: stryMutAct_9fa48("3061") ? "" : (stryCov_9fa48("3061"), 'field 1'),
    operator: stryMutAct_9fa48("3062") ? "" : (stryCov_9fa48("3062"), '='),
    value: stryMutAct_9fa48("3063") ? "" : (stryCov_9fa48("3063"), 'value 1')
  }), stryMutAct_9fa48("3064") ? {} : (stryCov_9fa48("3064"), {
    field: stryMutAct_9fa48("3065") ? "" : (stryCov_9fa48("3065"), 'field 2'),
    operator: stryMutAct_9fa48("3066") ? "" : (stryCov_9fa48("3066"), '!='),
    value: stryMutAct_9fa48("3067") ? "" : (stryCov_9fa48("3067"), 'value 2')
  }), stryMutAct_9fa48("3068") ? {} : (stryCov_9fa48("3068"), {
    field: stryMutAct_9fa48("3069") ? "" : (stryCov_9fa48("3069"), 'field 3'),
    operator: stryMutAct_9fa48("3070") ? "" : (stryCov_9fa48("3070"), '!~'),
    value: stryMutAct_9fa48("3071") ? "" : (stryCov_9fa48("3071"), 'value 3')
  })])
});
export const actionData: Action = stryMutAct_9fa48("3072") ? {} : (stryCov_9fa48("3072"), {
  id: stryMutAct_9fa48("3073") ? "" : (stryCov_9fa48("3073"), '1action'),
  nickname: stryMutAct_9fa48("3074") ? "" : (stryCov_9fa48("3074"), 'action'),
  status: stryMutAct_9fa48("3075") ? "" : (stryCov_9fa48("3075"), 'SUCCESS'),
  triggeredAt: stryMutAct_9fa48("3076") ? "" : (stryCov_9fa48("3076"), '10/08/2015 12:35'),
  actionType: stryMutAct_9fa48("3077") ? "" : (stryCov_9fa48("3077"), 'Circle promotion')
});
export const actionForm = stryMutAct_9fa48("3078") ? {} : (stryCov_9fa48("3078"), {
  actionId: stryMutAct_9fa48("3079") ? "" : (stryCov_9fa48("3079"), '1'),
  nickname: stryMutAct_9fa48("3080") ? "" : (stryCov_9fa48("3080"), 'foobar'),
  circleId: stryMutAct_9fa48("3081") ? "" : (stryCov_9fa48("3081"), '4')
});
export const actionType = stryMutAct_9fa48("3082") ? {} : (stryCov_9fa48("3082"), {
  id: stryMutAct_9fa48("3083") ? "" : (stryCov_9fa48("3083"), '1'),
  createdAt: stryMutAct_9fa48("3084") ? "" : (stryCov_9fa48("3084"), '2020'),
  workspaceId: stryMutAct_9fa48("3085") ? "" : (stryCov_9fa48("3085"), '123'),
  nickname: stryMutAct_9fa48("3086") ? "" : (stryCov_9fa48("3086"), 'foobar'),
  type: stryMutAct_9fa48("3087") ? "" : (stryCov_9fa48("3087"), 'circledeployment'),
  description: stryMutAct_9fa48("3088") ? "" : (stryCov_9fa48("3088"), 'description x'),
  configuration: stryMutAct_9fa48("3089") ? "" : (stryCov_9fa48("3089"), '{ "fake": "json" }')
});
export const actionsType = stryMutAct_9fa48("3090") ? [] : (stryCov_9fa48("3090"), [actionType]);
export const metricGroupItem = stryMutAct_9fa48("3091") ? {} : (stryCov_9fa48("3091"), {
  id: stryMutAct_9fa48("3092") ? "" : (stryCov_9fa48("3092"), "d4b69bf8-34cd-4bf0-81c3-781202f17fe7"),
  circleId: stryMutAct_9fa48("3093") ? "" : (stryCov_9fa48("3093"), "d4b69bf8-34cd-4bf0-81c3-781202f16dd6"),
  name: stryMutAct_9fa48("3094") ? "" : (stryCov_9fa48("3094"), "test 1"),
  metrics: stryMutAct_9fa48("3095") ? [] : (stryCov_9fa48("3095"), [metricsData]),
  actions: stryMutAct_9fa48("3096") ? [] : (stryCov_9fa48("3096"), [actionData]),
  status: stryMutAct_9fa48("3097") ? "" : (stryCov_9fa48("3097"), "ACTIVE")
});
export const metricsGroupData = stryMutAct_9fa48("3098") ? [] : (stryCov_9fa48("3098"), [metricGroupItem]);
export const metricsGroupWithoutMetricData = stryMutAct_9fa48("3099") ? [] : (stryCov_9fa48("3099"), [stryMutAct_9fa48("3100") ? {} : (stryCov_9fa48("3100"), {
  id: stryMutAct_9fa48("3101") ? "" : (stryCov_9fa48("3101"), "d4b69bf8-34cd-4bf0-81c3-781202f17fe7"),
  circleId: stryMutAct_9fa48("3102") ? "" : (stryCov_9fa48("3102"), "d4b69bf8-34cd-4bf0-81c3-781202f16dd6"),
  name: stryMutAct_9fa48("3103") ? "" : (stryCov_9fa48("3103"), "test 1"),
  metrics: stryMutAct_9fa48("3104") ? ["Stryker was here"] : (stryCov_9fa48("3104"), []),
  actions: stryMutAct_9fa48("3105") ? ["Stryker was here"] : (stryCov_9fa48("3105"), []),
  status: stryMutAct_9fa48("3106") ? "" : (stryCov_9fa48("3106"), "ACTIVE")
})]);
export const optionsValues = stryMutAct_9fa48("3107") ? [] : (stryCov_9fa48("3107"), [stryMutAct_9fa48("3108") ? {} : (stryCov_9fa48("3108"), {
  "label": stryMutAct_9fa48("3109") ? "" : (stryCov_9fa48("3109"), "1"),
  "value": stryMutAct_9fa48("3110") ? "" : (stryCov_9fa48("3110"), "1")
}), stryMutAct_9fa48("3111") ? {} : (stryCov_9fa48("3111"), {
  "label": stryMutAct_9fa48("3112") ? "" : (stryCov_9fa48("3112"), "2"),
  "value": stryMutAct_9fa48("3113") ? "" : (stryCov_9fa48("3113"), "2")
})]);
export const thresholdStatusResponse = stryMutAct_9fa48("3114") ? [] : (stryCov_9fa48("3114"), [stryMutAct_9fa48("3115") ? {} : (stryCov_9fa48("3115"), {
  icon: stryMutAct_9fa48("3116") ? "" : (stryCov_9fa48("3116"), 'bell'),
  color: stryMutAct_9fa48("3117") ? "" : (stryCov_9fa48("3117"), 'reached'),
  message: stryMutAct_9fa48("3118") ? "" : (stryCov_9fa48("3118"), 'This metric has reached its goal.'),
  ResumeMessage: stryMutAct_9fa48("3119") ? "" : (stryCov_9fa48("3119"), 'This metrics group has reached its goal.')
}), stryMutAct_9fa48("3120") ? {} : (stryCov_9fa48("3120"), {
  icon: stryMutAct_9fa48("3121") ? "" : (stryCov_9fa48("3121"), 'error'),
  color: stryMutAct_9fa48("3122") ? "" : (stryCov_9fa48("3122"), 'error'),
  message: stryMutAct_9fa48("3123") ? "" : (stryCov_9fa48("3123"), 'An error occurred in this metric.'),
  ResumeMessage: stryMutAct_9fa48("3124") ? "" : (stryCov_9fa48("3124"), 'There is at least one error in your metrics group.')
}), stryMutAct_9fa48("3125") ? {} : (stryCov_9fa48("3125"), {
  icon: stryMutAct_9fa48("3126") ? "" : (stryCov_9fa48("3126"), 'bell'),
  color: stryMutAct_9fa48("3127") ? "" : (stryCov_9fa48("3127"), 'active'),
  message: stryMutAct_9fa48("3128") ? "" : (stryCov_9fa48("3128"), 'This metric has not yet reached its goal.'),
  ResumeMessage: stryMutAct_9fa48("3129") ? "" : (stryCov_9fa48("3129"), 'This metrics group has not yet reached its goal.')
})]);
export const dataForMetricsSeriesTests = stryMutAct_9fa48("3130") ? [] : (stryCov_9fa48("3130"), [stryMutAct_9fa48("3131") ? {} : (stryCov_9fa48("3131"), {
  id: stryMutAct_9fa48("3132") ? "" : (stryCov_9fa48("3132"), '1'),
  metric: stryMutAct_9fa48("3133") ? "" : (stryCov_9fa48("3133"), 'test 1'),
  result: stryMutAct_9fa48("3134") ? [] : (stryCov_9fa48("3134"), [stryMutAct_9fa48("3135") ? {} : (stryCov_9fa48("3135"), {
    total: 10,
    period: 1
  })])
}), stryMutAct_9fa48("3136") ? {} : (stryCov_9fa48("3136"), {
  id: stryMutAct_9fa48("3137") ? "" : (stryCov_9fa48("3137"), '2'),
  metric: stryMutAct_9fa48("3138") ? "" : (stryCov_9fa48("3138"), 'test 2'),
  result: stryMutAct_9fa48("3139") ? [] : (stryCov_9fa48("3139"), [stryMutAct_9fa48("3140") ? {} : (stryCov_9fa48("3140"), {
    total: 10,
    period: 1
  })])
})]);
export const dataFormatted = ([{
  name: 'test 1',
  data: [{
    y: 10,
    x: 1000
  }]
}, {
  name: 'test 2',
  data: [{
    y: 10,
    x: 1000
  }]
}] as ChartData[]);
export const allSelect = stryMutAct_9fa48("3141") ? [] : (stryCov_9fa48("3141"), [stryMutAct_9fa48("3142") ? {} : (stryCov_9fa48("3142"), {
  label: stryMutAct_9fa48("3143") ? "" : (stryCov_9fa48("3143"), 'select all'),
  value: stryMutAct_9fa48("3144") ? "" : (stryCov_9fa48("3144"), '*')
})]);
export const someIsSelect = stryMutAct_9fa48("3145") ? [] : (stryCov_9fa48("3145"), [stryMutAct_9fa48("3146") ? {} : (stryCov_9fa48("3146"), {
  label: stryMutAct_9fa48("3147") ? "" : (stryCov_9fa48("3147"), 'test 2'),
  value: stryMutAct_9fa48("3148") ? "" : (stryCov_9fa48("3148"), 'test 2')
})]);
export const dataFormattedAndFilter = ([{
  name: 'test 2',
  data: [{
    y: 10,
    x: 1000
  }]
}] as ChartData[]);