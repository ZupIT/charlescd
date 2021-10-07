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

import { chartDateFormatter as formatter } from './helpers';
import { humanizeDurationFromSeconds } from 'core/utils/date';
import { getTheme } from 'core/utils/themes';
const theme = getTheme();
export default stryMutAct_9fa48("4924") ? {} : (stryCov_9fa48("4924"), {
  chart: stryMutAct_9fa48("4925") ? {} : (stryCov_9fa48("4925"), {
    id: stryMutAct_9fa48("4926") ? "" : (stryCov_9fa48("4926"), 'chartDeploy'),
    background: stryMutAct_9fa48("4927") ? "" : (stryCov_9fa48("4927"), 'transparent'),
    type: stryMutAct_9fa48("4928") ? "" : (stryCov_9fa48("4928"), 'line'),
    stacked: stryMutAct_9fa48("4929") ? true : (stryCov_9fa48("4929"), false)
  }),
  title: stryMutAct_9fa48("4930") ? {} : (stryCov_9fa48("4930"), {
    text: stryMutAct_9fa48("4931") ? "" : (stryCov_9fa48("4931"), 'Deploy'),
    offsetY: stryMutAct_9fa48("4932") ? +5 : (stryCov_9fa48("4932"), -5),
    offsetX: 10,
    style: stryMutAct_9fa48("4933") ? {} : (stryCov_9fa48("4933"), {
      fontSize: stryMutAct_9fa48("4934") ? "" : (stryCov_9fa48("4934"), '18px'),
      fontWeight: stryMutAct_9fa48("4935") ? "" : (stryCov_9fa48("4935"), 'bold'),
      color: theme.metrics.dashboard.chart.label
    })
  }),
  colors: stryMutAct_9fa48("4936") ? [] : (stryCov_9fa48("4936"), [theme.metrics.dashboard.chart.deploy, theme.metrics.dashboard.chart.error, theme.metrics.dashboard.chart.averageTime]),
  stroke: stryMutAct_9fa48("4937") ? {} : (stryCov_9fa48("4937"), {
    width: stryMutAct_9fa48("4938") ? [] : (stryCov_9fa48("4938"), [5, 5, 2]),
    curve: stryMutAct_9fa48("4939") ? "" : (stryCov_9fa48("4939"), 'smooth'),
    dashArray: stryMutAct_9fa48("4940") ? [] : (stryCov_9fa48("4940"), [0, 0, 5]),
    colors: stryMutAct_9fa48("4941") ? [] : (stryCov_9fa48("4941"), [stryMutAct_9fa48("4942") ? "" : (stryCov_9fa48("4942"), '00'), stryMutAct_9fa48("4943") ? "" : (stryCov_9fa48("4943"), '00'), theme.metrics.dashboard.chart.averageTime])
  }),
  fill: stryMutAct_9fa48("4944") ? {} : (stryCov_9fa48("4944"), {
    opacity: 1,
    type: stryMutAct_9fa48("4945") ? [] : (stryCov_9fa48("4945"), [stryMutAct_9fa48("4946") ? "" : (stryCov_9fa48("4946"), 'fill'), stryMutAct_9fa48("4947") ? "" : (stryCov_9fa48("4947"), 'fill'), stryMutAct_9fa48("4948") ? "" : (stryCov_9fa48("4948"), 'gradient')]),
    gradient: stryMutAct_9fa48("4949") ? {} : (stryCov_9fa48("4949"), {
      inverseColors: stryMutAct_9fa48("4950") ? true : (stryCov_9fa48("4950"), false),
      shade: stryMutAct_9fa48("4951") ? "" : (stryCov_9fa48("4951"), 'dark'),
      type: stryMutAct_9fa48("4952") ? "" : (stryCov_9fa48("4952"), 'vertical'),
      opacityFrom: 0.4,
      opacityTo: 0.35,
      stops: stryMutAct_9fa48("4953") ? [] : (stryCov_9fa48("4953"), [0, 80])
    })
  }),
  theme: stryMutAct_9fa48("4954") ? {} : (stryCov_9fa48("4954"), {
    mode: stryMutAct_9fa48("4955") ? "" : (stryCov_9fa48("4955"), 'dark')
  }),
  grid: stryMutAct_9fa48("4956") ? {} : (stryCov_9fa48("4956"), {
    show: stryMutAct_9fa48("4957") ? false : (stryCov_9fa48("4957"), true),
    yaxis: stryMutAct_9fa48("4958") ? {} : (stryCov_9fa48("4958"), {
      lines: stryMutAct_9fa48("4959") ? {} : (stryCov_9fa48("4959"), {
        show: stryMutAct_9fa48("4960") ? false : (stryCov_9fa48("4960"), true)
      })
    }),
    padding: stryMutAct_9fa48("4961") ? {} : (stryCov_9fa48("4961"), {
      left: 8,
      right: 14
    })
  }),
  legend: stryMutAct_9fa48("4962") ? {} : (stryCov_9fa48("4962"), {
    show: stryMutAct_9fa48("4963") ? false : (stryCov_9fa48("4963"), true),
    showForNullSeries: stryMutAct_9fa48("4964") ? false : (stryCov_9fa48("4964"), true),
    showForSingleSeries: stryMutAct_9fa48("4965") ? false : (stryCov_9fa48("4965"), true),
    showForZeroSeries: stryMutAct_9fa48("4966") ? false : (stryCov_9fa48("4966"), true),
    offsetY: stryMutAct_9fa48("4967") ? +10 : (stryCov_9fa48("4967"), -10),
    position: stryMutAct_9fa48("4968") ? "" : (stryCov_9fa48("4968"), 'top'),
    horizontalAlign: stryMutAct_9fa48("4969") ? "" : (stryCov_9fa48("4969"), 'left'),
    markers: stryMutAct_9fa48("4970") ? {} : (stryCov_9fa48("4970"), {
      radius: 50
    }),
    itemMargin: stryMutAct_9fa48("4971") ? {} : (stryCov_9fa48("4971"), {
      horizontal: 10
    })
  }),
  onItemClick: stryMutAct_9fa48("4972") ? {} : (stryCov_9fa48("4972"), {
    toggleDataSeries: stryMutAct_9fa48("4973") ? false : (stryCov_9fa48("4973"), true)
  }),
  tooltip: stryMutAct_9fa48("4974") ? {} : (stryCov_9fa48("4974"), {
    y: stryMutAct_9fa48("4975") ? [] : (stryCov_9fa48("4975"), [stryMutAct_9fa48("4976") ? "Stryker was here!" : (stryCov_9fa48("4976"), ''), stryMutAct_9fa48("4977") ? "Stryker was here!" : (stryCov_9fa48("4977"), ''), stryMutAct_9fa48("4978") ? {} : (stryCov_9fa48("4978"), {
      formatter: function (value: number) {
        if (stryMutAct_9fa48("4979")) {
          {}
        } else {
          stryCov_9fa48("4979");
          return humanizeDurationFromSeconds(value);
        }
      }
    })])
  }),
  yaxis: stryMutAct_9fa48("4980") ? [] : (stryCov_9fa48("4980"), [stryMutAct_9fa48("4981") ? {} : (stryCov_9fa48("4981"), {
    seriesName: stryMutAct_9fa48("4982") ? "" : (stryCov_9fa48("4982"), 'Deploy'),
    showAlways: stryMutAct_9fa48("4983") ? false : (stryCov_9fa48("4983"), true),
    tickAmount: 6,
    min: 0,
    axisTicks: stryMutAct_9fa48("4984") ? {} : (stryCov_9fa48("4984"), {
      show: stryMutAct_9fa48("4985") ? true : (stryCov_9fa48("4985"), false)
    }),
    axisBorder: stryMutAct_9fa48("4986") ? {} : (stryCov_9fa48("4986"), {
      show: stryMutAct_9fa48("4987") ? false : (stryCov_9fa48("4987"), true),
      color: theme.metrics.dashboard.chart.border
    }),
    labels: stryMutAct_9fa48("4988") ? {} : (stryCov_9fa48("4988"), {
      style: stryMutAct_9fa48("4989") ? {} : (stryCov_9fa48("4989"), {
        colors: theme.metrics.dashboard.chart.label
      })
    })
  }), stryMutAct_9fa48("4990") ? {} : (stryCov_9fa48("4990"), {
    seriesName: stryMutAct_9fa48("4991") ? "" : (stryCov_9fa48("4991"), 'Deploy'),
    show: stryMutAct_9fa48("4992") ? true : (stryCov_9fa48("4992"), false)
  }), stryMutAct_9fa48("4993") ? {} : (stryCov_9fa48("4993"), {
    seriesName: stryMutAct_9fa48("4994") ? "" : (stryCov_9fa48("4994"), 'Avagere Time'),
    showAlways: stryMutAct_9fa48("4995") ? false : (stryCov_9fa48("4995"), true),
    tickAmount: 6,
    min: 0,
    opposite: stryMutAct_9fa48("4996") ? false : (stryCov_9fa48("4996"), true),
    axisTicks: stryMutAct_9fa48("4997") ? {} : (stryCov_9fa48("4997"), {
      show: stryMutAct_9fa48("4998") ? true : (stryCov_9fa48("4998"), false)
    }),
    axisBorder: stryMutAct_9fa48("4999") ? {} : (stryCov_9fa48("4999"), {
      show: stryMutAct_9fa48("5000") ? false : (stryCov_9fa48("5000"), true),
      color: theme.metrics.dashboard.chart.border
    }),
    labels: stryMutAct_9fa48("5001") ? {} : (stryCov_9fa48("5001"), {
      style: stryMutAct_9fa48("5002") ? {} : (stryCov_9fa48("5002"), {
        colors: theme.metrics.dashboard.chart.label
      }),
      formatter: function (value: number) {
        if (stryMutAct_9fa48("5003")) {
          {}
        } else {
          stryCov_9fa48("5003");
          return humanizeDurationFromSeconds(value);
        }
      }
    })
  })]),
  xaxis: stryMutAct_9fa48("5004") ? {} : (stryCov_9fa48("5004"), {
    type: stryMutAct_9fa48("5005") ? "" : (stryCov_9fa48("5005"), 'category'),
    tickAmount: stryMutAct_9fa48("5006") ? "" : (stryCov_9fa48("5006"), 'dataPoints'),
    axisBorder: stryMutAct_9fa48("5007") ? {} : (stryCov_9fa48("5007"), {
      show: stryMutAct_9fa48("5008") ? true : (stryCov_9fa48("5008"), false),
      offsetY: stryMutAct_9fa48("5009") ? +10 : (stryCov_9fa48("5009"), -10)
    }),
    labels: stryMutAct_9fa48("5010") ? {} : (stryCov_9fa48("5010"), {
      hideOverlappingLabels: stryMutAct_9fa48("5011") ? true : (stryCov_9fa48("5011"), false),
      style: stryMutAct_9fa48("5012") ? {} : (stryCov_9fa48("5012"), {
        color: theme.metrics.dashboard.chart.labels,
        fontSize: stryMutAct_9fa48("5013") ? "" : (stryCov_9fa48("5013"), '10px')
      }),
      formatter
    })
  })
});