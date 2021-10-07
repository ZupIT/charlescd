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

export const workspaceItem = stryMutAct_9fa48("6932") ? {} : (stryCov_9fa48("6932"), {
  id: stryMutAct_9fa48("6933") ? "" : (stryCov_9fa48("6933"), '619e881f-3a87-4ebd-acb1-ab4923ed497e'),
  name: stryMutAct_9fa48("6934") ? "" : (stryCov_9fa48("6934"), 'workspace'),
  status: stryMutAct_9fa48("6935") ? "" : (stryCov_9fa48("6935"), 'COMPLETE')
});
export const workspaces = stryMutAct_9fa48("6936") ? {} : (stryCov_9fa48("6936"), {
  content: stryMutAct_9fa48("6937") ? [] : (stryCov_9fa48("6937"), [stryMutAct_9fa48("6938") ? {} : (stryCov_9fa48("6938"), {
    id: stryMutAct_9fa48("6939") ? "" : (stryCov_9fa48("6939"), 'efbf25e0-c4dc-46c5-9fe4-61eb24049ac7'),
    name: stryMutAct_9fa48("6940") ? "" : (stryCov_9fa48("6940"), 'Workspace 1'),
    status: stryMutAct_9fa48("6941") ? "" : (stryCov_9fa48("6941"), 'COMPLETE'),
    authorId: stryMutAct_9fa48("6942") ? "" : (stryCov_9fa48("6942"), 'a7c3e4b6-2be6-4d62-8540-e2d6d5f4e03f'),
    gitConfiguration: stryMutAct_9fa48("6943") ? "Stryker was here!" : (stryCov_9fa48("6943"), ''),
    registryConfiguration: stryMutAct_9fa48("6944") ? "Stryker was here!" : (stryCov_9fa48("6944"), ''),
    cdConfiguration: stryMutAct_9fa48("6945") ? "Stryker was here!" : (stryCov_9fa48("6945"), ''),
    circleMatcherUrl: stryMutAct_9fa48("6946") ? "" : (stryCov_9fa48("6946"), 'https://charles-api.com/darwin-circle-matcher'),
    metricConfiguration: stryMutAct_9fa48("6947") ? "Stryker was here!" : (stryCov_9fa48("6947"), ''),
    userGroups: stryMutAct_9fa48("6948") ? [] : (stryCov_9fa48("6948"), [stryMutAct_9fa48("6949") ? {} : (stryCov_9fa48("6949"), {
      id: stryMutAct_9fa48("6950") ? "" : (stryCov_9fa48("6950"), 'bf98232d-6784-419b-a737-cc4391430de9'),
      name: stryMutAct_9fa48("6951") ? "" : (stryCov_9fa48("6951"), 'User Group 1'),
      author: stryMutAct_9fa48("6952") ? {} : (stryCov_9fa48("6952"), {
        id: stryMutAct_9fa48("6953") ? "" : (stryCov_9fa48("6953"), 'c7e6dete-aa7a-4216-be1b-34eacd4c2915'),
        name: stryMutAct_9fa48("6954") ? "" : (stryCov_9fa48("6954"), 'User 1'),
        email: stryMutAct_9fa48("6955") ? "" : (stryCov_9fa48("6955"), 'user.1@zup.com.br'),
        createdAt: stryMutAct_9fa48("6956") ? "" : (stryCov_9fa48("6956"), '2020-05-07 20:24:46')
      }),
      createdAt: stryMutAct_9fa48("6957") ? "" : (stryCov_9fa48("6957"), '2020-04-16T14:09:41.599193'),
      users: stryMutAct_9fa48("6958") ? ["Stryker was here"] : (stryCov_9fa48("6958"), [])
    }), stryMutAct_9fa48("6959") ? {} : (stryCov_9fa48("6959"), {
      id: stryMutAct_9fa48("6960") ? "" : (stryCov_9fa48("6960"), 'f0cda81f-a7cb-4036-938d-33cbb959cc4a'),
      name: stryMutAct_9fa48("6961") ? "" : (stryCov_9fa48("6961"), 'User Group 3'),
      author: stryMutAct_9fa48("6962") ? {} : (stryCov_9fa48("6962"), {
        id: stryMutAct_9fa48("6963") ? "" : (stryCov_9fa48("6963"), '8b81e7a7-33f1-46cb-aedf-73222bf8769f'),
        name: stryMutAct_9fa48("6964") ? "" : (stryCov_9fa48("6964"), 'User 4'),
        email: stryMutAct_9fa48("6965") ? "" : (stryCov_9fa48("6965"), 'user.4@zup.com.br'),
        createdAt: stryMutAct_9fa48("6966") ? "" : (stryCov_9fa48("6966"), '2020-05-13 21:50:28')
      }),
      createdAt: stryMutAct_9fa48("6967") ? "" : (stryCov_9fa48("6967"), '2020-04-16T01:10:29.123966'),
      users: stryMutAct_9fa48("6968") ? ["Stryker was here"] : (stryCov_9fa48("6968"), [])
    }), stryMutAct_9fa48("6969") ? {} : (stryCov_9fa48("6969"), {
      id: stryMutAct_9fa48("6970") ? "" : (stryCov_9fa48("6970"), 'e0564c7b-757f-4aaa-93c5-337415a67fc7'),
      name: stryMutAct_9fa48("6971") ? "" : (stryCov_9fa48("6971"), 'User Group 2'),
      author: stryMutAct_9fa48("6972") ? {} : (stryCov_9fa48("6972"), {
        id: stryMutAct_9fa48("6973") ? "" : (stryCov_9fa48("6973"), 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45'),
        name: stryMutAct_9fa48("6974") ? "" : (stryCov_9fa48("6974"), 'User 5'),
        email: stryMutAct_9fa48("6975") ? "" : (stryCov_9fa48("6975"), 'user.5@zup.com.br'),
        createdAt: stryMutAct_9fa48("6976") ? "" : (stryCov_9fa48("6976"), '2020-05-13 18:02:03')
      }),
      createdAt: stryMutAct_9fa48("6977") ? "" : (stryCov_9fa48("6977"), '2020-04-15T20:49:47.048969'),
      users: stryMutAct_9fa48("6978") ? [] : (stryCov_9fa48("6978"), [stryMutAct_9fa48("6979") ? {} : (stryCov_9fa48("6979"), {
        id: stryMutAct_9fa48("6980") ? "" : (stryCov_9fa48("6980"), '13ea193b-f9d2-4wed-b1ce-471a7ae871c2'),
        name: stryMutAct_9fa48("6981") ? "" : (stryCov_9fa48("6981"), 'User 3'),
        email: stryMutAct_9fa48("6982") ? "" : (stryCov_9fa48("6982"), 'user.3@zup.com.br'),
        createdAt: stryMutAct_9fa48("6983") ? "" : (stryCov_9fa48("6983"), '2020-05-19 17:48:47')
      }), stryMutAct_9fa48("6984") ? {} : (stryCov_9fa48("6984"), {
        id: stryMutAct_9fa48("6985") ? "" : (stryCov_9fa48("6985"), 'a7c3e4b6-4be3-4d62-8140-e2d23214e03f'),
        name: stryMutAct_9fa48("6986") ? "" : (stryCov_9fa48("6986"), 'User 2'),
        email: stryMutAct_9fa48("6987") ? "" : (stryCov_9fa48("6987"), 'user.2@zup.com.br'),
        createdAt: stryMutAct_9fa48("6988") ? "" : (stryCov_9fa48("6988"), '2020-04-30 17:10:52')
      })])
    })]),
    createdAt: stryMutAct_9fa48("6989") ? "" : (stryCov_9fa48("6989"), '2020-05-13 12:07:32')
  }), stryMutAct_9fa48("6990") ? {} : (stryCov_9fa48("6990"), {
    id: stryMutAct_9fa48("6991") ? "" : (stryCov_9fa48("6991"), 'b53e07a4-8b0d-449d-985a-970a9a0e0576'),
    name: stryMutAct_9fa48("6992") ? "" : (stryCov_9fa48("6992"), 'Workspace 2'),
    status: stryMutAct_9fa48("6993") ? "" : (stryCov_9fa48("6993"), 'COMPLETE'),
    authorId: stryMutAct_9fa48("6994") ? "" : (stryCov_9fa48("6994"), 'a7c3e4b6-2be6-4d62-8540-e2d6d5f4e03f'),
    gitConfiguration: null,
    registryConfiguration: null,
    cdConfiguration: null,
    circleMatcherUrl: stryMutAct_9fa48("6995") ? "" : (stryCov_9fa48("6995"), 'https://charles-api.com/darwin-circle-matcher'),
    metricConfiguration: null,
    userGroups: stryMutAct_9fa48("6996") ? [] : (stryCov_9fa48("6996"), [stryMutAct_9fa48("6997") ? {} : (stryCov_9fa48("6997"), {
      id: stryMutAct_9fa48("6998") ? "" : (stryCov_9fa48("6998"), 'bf98232d-6784-419b-a737-cc4391430de9'),
      name: stryMutAct_9fa48("6999") ? "" : (stryCov_9fa48("6999"), 'User Group 1'),
      author: stryMutAct_9fa48("7000") ? {} : (stryCov_9fa48("7000"), {
        id: stryMutAct_9fa48("7001") ? "" : (stryCov_9fa48("7001"), 'c7e6dete-aa7a-4216-be1b-34eacd4c2915'),
        name: stryMutAct_9fa48("7002") ? "" : (stryCov_9fa48("7002"), 'User 1'),
        email: stryMutAct_9fa48("7003") ? "" : (stryCov_9fa48("7003"), 'user.1@zup.com.br'),
        createdAt: stryMutAct_9fa48("7004") ? "" : (stryCov_9fa48("7004"), '2020-05-07 20:24:46')
      }),
      createdAt: stryMutAct_9fa48("7005") ? "" : (stryCov_9fa48("7005"), '2020-04-16T14:09:41.599193'),
      users: stryMutAct_9fa48("7006") ? ["Stryker was here"] : (stryCov_9fa48("7006"), [])
    })]),
    createdAt: stryMutAct_9fa48("7007") ? "" : (stryCov_9fa48("7007"), '2020-05-15 14:29:53')
  }), stryMutAct_9fa48("7008") ? {} : (stryCov_9fa48("7008"), {
    id: stryMutAct_9fa48("7009") ? "" : (stryCov_9fa48("7009"), '034d2225-d7b2-499e-96e2-53cac99ff405'),
    name: stryMutAct_9fa48("7010") ? "" : (stryCov_9fa48("7010"), 'Workspace 3'),
    status: stryMutAct_9fa48("7011") ? "" : (stryCov_9fa48("7011"), 'INCOMPLETE'),
    authorId: stryMutAct_9fa48("7012") ? "" : (stryCov_9fa48("7012"), 'a7c3e4b6-2be6-4d62-8540-e2d6d5f4e03f'),
    gitConfiguration: null,
    registryConfiguration: null,
    cdConfiguration: null,
    circleMatcherUrl: null,
    metricConfiguration: null,
    userGroups: stryMutAct_9fa48("7013") ? [] : (stryCov_9fa48("7013"), [stryMutAct_9fa48("7014") ? {} : (stryCov_9fa48("7014"), {
      id: stryMutAct_9fa48("7015") ? "" : (stryCov_9fa48("7015"), 'e0564c7b-757f-4aaa-93c5-337415a67fc7'),
      name: stryMutAct_9fa48("7016") ? "" : (stryCov_9fa48("7016"), 'User Group 2'),
      author: stryMutAct_9fa48("7017") ? {} : (stryCov_9fa48("7017"), {
        id: stryMutAct_9fa48("7018") ? "" : (stryCov_9fa48("7018"), 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45'),
        name: stryMutAct_9fa48("7019") ? "" : (stryCov_9fa48("7019"), 'User 5'),
        email: stryMutAct_9fa48("7020") ? "" : (stryCov_9fa48("7020"), 'user.5@zup.com.br'),
        createdAt: stryMutAct_9fa48("7021") ? "" : (stryCov_9fa48("7021"), '2020-05-13 18:02:03')
      }),
      createdAt: stryMutAct_9fa48("7022") ? "" : (stryCov_9fa48("7022"), '2020-04-15T20:49:47.048969'),
      users: stryMutAct_9fa48("7023") ? [] : (stryCov_9fa48("7023"), [stryMutAct_9fa48("7024") ? {} : (stryCov_9fa48("7024"), {
        id: stryMutAct_9fa48("7025") ? "" : (stryCov_9fa48("7025"), '13ea193b-f9d2-4wed-b1ce-471a7ae871c2'),
        name: stryMutAct_9fa48("7026") ? "" : (stryCov_9fa48("7026"), 'User 3'),
        email: stryMutAct_9fa48("7027") ? "" : (stryCov_9fa48("7027"), 'user.3@zup.com.br'),
        createdAt: stryMutAct_9fa48("7028") ? "" : (stryCov_9fa48("7028"), '2020-05-19 17:48:47')
      }), stryMutAct_9fa48("7029") ? {} : (stryCov_9fa48("7029"), {
        id: stryMutAct_9fa48("7030") ? "" : (stryCov_9fa48("7030"), 'a7c3e4b6-4be3-4d62-8140-e2d23214e03f'),
        name: stryMutAct_9fa48("7031") ? "" : (stryCov_9fa48("7031"), 'User 2'),
        email: stryMutAct_9fa48("7032") ? "" : (stryCov_9fa48("7032"), 'user.2@zup.com.br'),
        createdAt: stryMutAct_9fa48("7033") ? "" : (stryCov_9fa48("7033"), '2020-04-30 17:10:52')
      })])
    })]),
    createdAt: stryMutAct_9fa48("7034") ? "" : (stryCov_9fa48("7034"), '2020-05-19 17:51:14')
  }), stryMutAct_9fa48("7035") ? {} : (stryCov_9fa48("7035"), {
    id: stryMutAct_9fa48("7036") ? "" : (stryCov_9fa48("7036"), 'd90fd814-5e33-43c6-ba2d-d9d04c5a5ec6'),
    name: stryMutAct_9fa48("7037") ? "" : (stryCov_9fa48("7037"), 'Workspace 4'),
    status: stryMutAct_9fa48("7038") ? "" : (stryCov_9fa48("7038"), 'COMPLETE'),
    authorId: stryMutAct_9fa48("7039") ? "" : (stryCov_9fa48("7039"), 'a7c3e4b6-2be6-4d62-8540-e2d6d5f4e03f'),
    gitConfiguration: null,
    registryConfiguration: null,
    cdConfiguration: null,
    circleMatcherUrl: null,
    metricConfiguration: null,
    userGroups: stryMutAct_9fa48("7040") ? ["Stryker was here"] : (stryCov_9fa48("7040"), []),
    createdAt: stryMutAct_9fa48("7041") ? "" : (stryCov_9fa48("7041"), '2020-05-13 21:14:04')
  }), stryMutAct_9fa48("7042") ? {} : (stryCov_9fa48("7042"), {
    id: stryMutAct_9fa48("7043") ? "" : (stryCov_9fa48("7043"), '2369847c-94f7-43c9-87c2-4f00c73290e7'),
    name: stryMutAct_9fa48("7044") ? "" : (stryCov_9fa48("7044"), 'Workspace 5'),
    status: stryMutAct_9fa48("7045") ? "" : (stryCov_9fa48("7045"), 'COMPLETE'),
    authorId: stryMutAct_9fa48("7046") ? "" : (stryCov_9fa48("7046"), 'a7c3e4b6-2be6-4d62-8540-e2d6d5f4e03f'),
    gitConfiguration: null,
    registryConfiguration: null,
    cdConfiguration: null,
    circleMatcherUrl: stryMutAct_9fa48("7047") ? "" : (stryCov_9fa48("7047"), 'https://charles-api.com/darwin-circle-matcher'),
    metricConfiguration: null,
    userGroups: stryMutAct_9fa48("7048") ? [] : (stryCov_9fa48("7048"), [stryMutAct_9fa48("7049") ? {} : (stryCov_9fa48("7049"), {
      id: stryMutAct_9fa48("7050") ? "" : (stryCov_9fa48("7050"), 'f0cda81f-a7cb-4036-938d-33cbb959cc4a'),
      name: stryMutAct_9fa48("7051") ? "" : (stryCov_9fa48("7051"), 'User Group 3'),
      author: stryMutAct_9fa48("7052") ? {} : (stryCov_9fa48("7052"), {
        id: stryMutAct_9fa48("7053") ? "" : (stryCov_9fa48("7053"), '8b81e7a7-33f1-46cb-aedf-73222bf8769f'),
        name: stryMutAct_9fa48("7054") ? "" : (stryCov_9fa48("7054"), 'User 4'),
        email: stryMutAct_9fa48("7055") ? "" : (stryCov_9fa48("7055"), 'user.4@zup.com.br'),
        createdAt: stryMutAct_9fa48("7056") ? "" : (stryCov_9fa48("7056"), '2020-05-13 21:50:28')
      }),
      createdAt: stryMutAct_9fa48("7057") ? "" : (stryCov_9fa48("7057"), '2020-04-16T01:10:29.123966'),
      users: stryMutAct_9fa48("7058") ? ["Stryker was here"] : (stryCov_9fa48("7058"), [])
    }), stryMutAct_9fa48("7059") ? {} : (stryCov_9fa48("7059"), {
      id: stryMutAct_9fa48("7060") ? "" : (stryCov_9fa48("7060"), 'fad01026-870f-4616-a245-f8a753a9a4d7'),
      name: stryMutAct_9fa48("7061") ? "" : (stryCov_9fa48("7061"), 'User Group 4'),
      author: stryMutAct_9fa48("7062") ? {} : (stryCov_9fa48("7062"), {
        id: stryMutAct_9fa48("7063") ? "" : (stryCov_9fa48("7063"), 'c7e6dete-aa7a-4216-be1b-34eacd4c2915'),
        name: stryMutAct_9fa48("7064") ? "" : (stryCov_9fa48("7064"), 'User 1'),
        email: stryMutAct_9fa48("7065") ? "" : (stryCov_9fa48("7065"), 'user.1@zup.com.br'),
        createdAt: stryMutAct_9fa48("7066") ? "" : (stryCov_9fa48("7066"), '2020-05-07 20:24:46')
      }),
      createdAt: stryMutAct_9fa48("7067") ? "" : (stryCov_9fa48("7067"), '2020-04-16T13:29:13.880759'),
      users: stryMutAct_9fa48("7068") ? [] : (stryCov_9fa48("7068"), [stryMutAct_9fa48("7069") ? {} : (stryCov_9fa48("7069"), {
        id: stryMutAct_9fa48("7070") ? "" : (stryCov_9fa48("7070"), 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45'),
        name: stryMutAct_9fa48("7071") ? "" : (stryCov_9fa48("7071"), 'User 5'),
        email: stryMutAct_9fa48("7072") ? "" : (stryCov_9fa48("7072"), 'user.5@zup.com.br'),
        createdAt: stryMutAct_9fa48("7073") ? "" : (stryCov_9fa48("7073"), '2020-05-13 18:02:03')
      })])
    })]),
    createdAt: stryMutAct_9fa48("7074") ? "" : (stryCov_9fa48("7074"), '2020-05-13 13:24:43')
  })]),
  page: 0,
  size: 5,
  totalPages: 1,
  last: stryMutAct_9fa48("7075") ? false : (stryCov_9fa48("7075"), true)
});