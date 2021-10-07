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

export const releaseComponentsMock = stryMutAct_9fa48("4867") ? [] : (stryCov_9fa48("4867"), [stryMutAct_9fa48("4868") ? {} : (stryCov_9fa48("4868"), {
  moduleName: stryMutAct_9fa48("4869") ? "" : (stryCov_9fa48("4869"), 'module a1'),
  name: stryMutAct_9fa48("4870") ? "" : (stryCov_9fa48("4870"), 'component a1'),
  version: stryMutAct_9fa48("4871") ? "" : (stryCov_9fa48("4871"), '1')
}), stryMutAct_9fa48("4872") ? {} : (stryCov_9fa48("4872"), {
  moduleName: stryMutAct_9fa48("4873") ? "" : (stryCov_9fa48("4873"), 'module a2'),
  name: stryMutAct_9fa48("4874") ? "" : (stryCov_9fa48("4874"), 'component a2'),
  version: stryMutAct_9fa48("4875") ? "" : (stryCov_9fa48("4875"), '2')
})]);
export const ReleaseContentMock = stryMutAct_9fa48("4876") ? {} : (stryCov_9fa48("4876"), {
  id: stryMutAct_9fa48("4877") ? "" : (stryCov_9fa48("4877"), '1'),
  deployedAt: stryMutAct_9fa48("4878") ? "" : (stryCov_9fa48("4878"), '2020-07-12 19:10:26'),
  undeployedAt: stryMutAct_9fa48("4879") ? "" : (stryCov_9fa48("4879"), '2020-07-11 19:10:26'),
  authorName: stryMutAct_9fa48("4880") ? "" : (stryCov_9fa48("4880"), 'Jhon Doe'),
  circleName: stryMutAct_9fa48("4881") ? "" : (stryCov_9fa48("4881"), 'circle 1'),
  tag: stryMutAct_9fa48("4882") ? "" : (stryCov_9fa48("4882"), 'release 1'),
  status: stryMutAct_9fa48("4883") ? "" : (stryCov_9fa48("4883"), 'DEPLOYED'),
  deployDuration: 73,
  components: releaseComponentsMock
});
export const ReleaseSummary = stryMutAct_9fa48("4884") ? {} : (stryCov_9fa48("4884"), {
  deployed: 1,
  deploying: 2,
  failed: 3,
  undeploying: 4,
  notDeployed: 5
});
export const ReleasesMock = stryMutAct_9fa48("4885") ? {} : (stryCov_9fa48("4885"), {
  summary: ReleaseSummary,
  page: stryMutAct_9fa48("4886") ? {} : (stryCov_9fa48("4886"), {
    content: stryMutAct_9fa48("4887") ? [] : (stryCov_9fa48("4887"), [ReleaseContentMock]),
    page: 0,
    size: 1,
    last: stryMutAct_9fa48("4888") ? true : (stryCov_9fa48("4888"), false),
    totalPages: 1
  })
});
export const filter = stryMutAct_9fa48("4889") ? {} : (stryCov_9fa48("4889"), {
  period: stryMutAct_9fa48("4890") ? "" : (stryCov_9fa48("4890"), 'ONW_WEEK')
});