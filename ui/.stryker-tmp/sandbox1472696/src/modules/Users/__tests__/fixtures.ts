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

export const userPagination = stryMutAct_9fa48("6806") ? {} : (stryCov_9fa48("6806"), {
  content: stryMutAct_9fa48("6807") ? [] : (stryCov_9fa48("6807"), [stryMutAct_9fa48("6808") ? {} : (stryCov_9fa48("6808"), {
    id: stryMutAct_9fa48("6809") ? "" : (stryCov_9fa48("6809"), '123'),
    name: stryMutAct_9fa48("6810") ? "" : (stryCov_9fa48("6810"), 'charlesadmin'),
    email: stryMutAct_9fa48("6811") ? "" : (stryCov_9fa48("6811"), 'charlesadmin@admin'),
    applications: stryMutAct_9fa48("6812") ? [] : (stryCov_9fa48("6812"), [stryMutAct_9fa48("6813") ? "Stryker was here!" : (stryCov_9fa48("6813"), '')]),
    createdAt: stryMutAct_9fa48("6814") ? "" : (stryCov_9fa48("6814"), '01/29/2021')
  })]),
  page: 0,
  size: 0,
  totalPages: 0,
  last: stryMutAct_9fa48("6815") ? false : (stryCov_9fa48("6815"), true)
});