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

export const regenerateTitle = stryMutAct_9fa48("6602") ? "" : (stryCov_9fa48("6602"), 'Are you sure you want to regenerate the following token:');
export const regenerateDescription = stryMutAct_9fa48("6603") ? "" : (stryCov_9fa48("6603"), 'Any application or script using this token will no longer be able to access Charles C.D. APIs. You cannot undo this action. Do you want to continue?');
export const revokeTitle = stryMutAct_9fa48("6604") ? "" : (stryCov_9fa48("6604"), 'Are you sure you want to revoke the following token:');
export const revokeDescription = stryMutAct_9fa48("6605") ? "" : (stryCov_9fa48("6605"), 'Any application or script using this token will no longer be able to access Charles C.D. APIs. You cannot undo this action. Do you want to continue?');