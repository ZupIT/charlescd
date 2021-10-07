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

export default stryMutAct_9fa48("294") ? {} : (stryCov_9fa48("294"), {
  options: stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
    theme: stryMutAct_9fa48("296") ? {} : (stryCov_9fa48("296"), {
      mode: stryMutAct_9fa48("297") ? "" : (stryCov_9fa48("297"), 'dark')
    }),
    tooltip: stryMutAct_9fa48("298") ? {} : (stryCov_9fa48("298"), {
      theme: stryMutAct_9fa48("299") ? "" : (stryCov_9fa48("299"), 'dark')
    }),
    chart: stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
      sparkline: stryMutAct_9fa48("301") ? {} : (stryCov_9fa48("301"), {
        enabled: stryMutAct_9fa48("302") ? true : (stryCov_9fa48("302"), false)
      }),
      toolbar: stryMutAct_9fa48("303") ? {} : (stryCov_9fa48("303"), {
        show: stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304"), false)
      }),
      zoom: stryMutAct_9fa48("305") ? {} : (stryCov_9fa48("305"), {
        enabled: stryMutAct_9fa48("306") ? false : (stryCov_9fa48("306"), true)
      })
    }),
    yaxis: stryMutAct_9fa48("307") ? {} : (stryCov_9fa48("307"), {
      tickAmount: 2,
      labels: stryMutAct_9fa48("308") ? {} : (stryCov_9fa48("308"), {
        style: stryMutAct_9fa48("309") ? {} : (stryCov_9fa48("309"), {
          color: stryMutAct_9fa48("310") ? "" : (stryCov_9fa48("310"), '#fff')
        })
      })
    }),
    xaxis: stryMutAct_9fa48("311") ? {} : (stryCov_9fa48("311"), {
      type: stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), 'numeric'),
      tickAmount: 2,
      tickPlacement: stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'on'),
      axisBorder: stryMutAct_9fa48("314") ? {} : (stryCov_9fa48("314"), {
        show: stryMutAct_9fa48("315") ? true : (stryCov_9fa48("315"), false)
      })
    }),
    dataLabels: stryMutAct_9fa48("316") ? {} : (stryCov_9fa48("316"), {
      enabled: stryMutAct_9fa48("317") ? true : (stryCov_9fa48("317"), false)
    }),
    markers: stryMutAct_9fa48("318") ? {} : (stryCov_9fa48("318"), {
      size: 0,
      style: stryMutAct_9fa48("319") ? "" : (stryCov_9fa48("319"), 'hollow')
    }),
    grid: stryMutAct_9fa48("320") ? {} : (stryCov_9fa48("320"), {
      show: stryMutAct_9fa48("321") ? false : (stryCov_9fa48("321"), true),
      xaxis: stryMutAct_9fa48("322") ? {} : (stryCov_9fa48("322"), {
        lines: stryMutAct_9fa48("323") ? {} : (stryCov_9fa48("323"), {
          show: stryMutAct_9fa48("324") ? true : (stryCov_9fa48("324"), false)
        })
      }),
      yaxis: stryMutAct_9fa48("325") ? {} : (stryCov_9fa48("325"), {
        lines: stryMutAct_9fa48("326") ? {} : (stryCov_9fa48("326"), {
          show: stryMutAct_9fa48("327") ? true : (stryCov_9fa48("327"), false)
        })
      })
    }),
    stroke: stryMutAct_9fa48("328") ? {} : (stryCov_9fa48("328"), {
      show: stryMutAct_9fa48("329") ? false : (stryCov_9fa48("329"), true),
      curve: stryMutAct_9fa48("330") ? "" : (stryCov_9fa48("330"), 'straight'),
      lineCap: stryMutAct_9fa48("331") ? "" : (stryCov_9fa48("331"), 'butt'),
      width: 1.4,
      dashArray: 0
    }),
    noData: stryMutAct_9fa48("332") ? {} : (stryCov_9fa48("332"), {
      text: stryMutAct_9fa48("333") ? "" : (stryCov_9fa48("333"), 'No available data'),
      align: stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), 'center'),
      verticalAlign: stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), 'middle'),
      offsetX: 0,
      offsetY: 0,
      style: stryMutAct_9fa48("336") ? {} : (stryCov_9fa48("336"), {
        color: stryMutAct_9fa48("337") ? "" : (stryCov_9fa48("337"), '#FFF'),
        fontSize: stryMutAct_9fa48("338") ? "" : (stryCov_9fa48("338"), '14px')
      })
    })
  })
});