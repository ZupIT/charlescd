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

export const circlesHistory = stryMutAct_9fa48("4776") ? {} : (stryCov_9fa48("4776"), {
  summary: stryMutAct_9fa48("4777") ? {} : (stryCov_9fa48("4777"), {
    active: 10,
    inactive: 10
  }),
  page: stryMutAct_9fa48("4778") ? {} : (stryCov_9fa48("4778"), {
    content: stryMutAct_9fa48("4779") ? [] : (stryCov_9fa48("4779"), [stryMutAct_9fa48("4780") ? {} : (stryCov_9fa48("4780"), {
      id: stryMutAct_9fa48("4781") ? "" : (stryCov_9fa48("4781"), 'abc-123'),
      status: stryMutAct_9fa48("4782") ? "" : (stryCov_9fa48("4782"), 'ACTIVE'),
      name: stryMutAct_9fa48("4783") ? "" : (stryCov_9fa48("4783"), 'Circle A'),
      lastUpdatedAt: stryMutAct_9fa48("4784") ? "" : (stryCov_9fa48("4784"), '2020-07-12 10:25:38'),
      lifeTime: 345465
    }), stryMutAct_9fa48("4785") ? {} : (stryCov_9fa48("4785"), {
      id: stryMutAct_9fa48("4786") ? "" : (stryCov_9fa48("4786"), 'abc-1234'),
      status: stryMutAct_9fa48("4787") ? "" : (stryCov_9fa48("4787"), 'ACTIVE'),
      name: stryMutAct_9fa48("4788") ? "" : (stryCov_9fa48("4788"), 'Circle A'),
      lastUpdatedAt: stryMutAct_9fa48("4789") ? "" : (stryCov_9fa48("4789"), '2020-07-12 10:25:38'),
      lifeTime: 345465
    })]),
    page: 0,
    size: 1,
    isLast: stryMutAct_9fa48("4790") ? true : (stryCov_9fa48("4790"), false),
    totalPages: 1
  })
});
export const releaseComponentsMock = stryMutAct_9fa48("4791") ? [] : (stryCov_9fa48("4791"), [stryMutAct_9fa48("4792") ? {} : (stryCov_9fa48("4792"), {
  moduleName: stryMutAct_9fa48("4793") ? "" : (stryCov_9fa48("4793"), 'module a1'),
  name: stryMutAct_9fa48("4794") ? "" : (stryCov_9fa48("4794"), 'component a1'),
  version: stryMutAct_9fa48("4795") ? "" : (stryCov_9fa48("4795"), '1.0')
}), stryMutAct_9fa48("4796") ? {} : (stryCov_9fa48("4796"), {
  moduleName: stryMutAct_9fa48("4797") ? "" : (stryCov_9fa48("4797"), 'module a2'),
  name: stryMutAct_9fa48("4798") ? "" : (stryCov_9fa48("4798"), 'component a2'),
  version: stryMutAct_9fa48("4799") ? "" : (stryCov_9fa48("4799"), '1.0')
})]);
export const circleReleaseMock = stryMutAct_9fa48("4800") ? {} : (stryCov_9fa48("4800"), {
  id: stryMutAct_9fa48("4801") ? "" : (stryCov_9fa48("4801"), '1'),
  tag: stryMutAct_9fa48("4802") ? "" : (stryCov_9fa48("4802"), 'release 1'),
  deployedAt: stryMutAct_9fa48("4803") ? "" : (stryCov_9fa48("4803"), '2020-07-12 19:10:26'),
  undeployedAt: stryMutAct_9fa48("4804") ? "" : (stryCov_9fa48("4804"), '2020-07-11 19:10:26'),
  createdAt: stryMutAct_9fa48("4805") ? "" : (stryCov_9fa48("4805"), '2020-07-04 13:10:26'),
  authorName: stryMutAct_9fa48("4806") ? "" : (stryCov_9fa48("4806"), 'Jhon Doe'),
  components: releaseComponentsMock,
  status: stryMutAct_9fa48("4807") ? "" : (stryCov_9fa48("4807"), 'DEPLOYED')
});
export const circlesReleasesMock = stryMutAct_9fa48("4808") ? {} : (stryCov_9fa48("4808"), {
  content: stryMutAct_9fa48("4809") ? [] : (stryCov_9fa48("4809"), [circleReleaseMock, stryMutAct_9fa48("4810") ? {} : (stryCov_9fa48("4810"), { ...circleReleaseMock,
    id: stryMutAct_9fa48("4811") ? "" : (stryCov_9fa48("4811"), '2'),
    tag: stryMutAct_9fa48("4812") ? "" : (stryCov_9fa48("4812"), 'release 2')
  })]),
  page: 0,
  size: 1,
  last: stryMutAct_9fa48("4813") ? true : (stryCov_9fa48("4813"), false),
  totalPages: 1
});