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

import styled from 'styled-components';
type LoaderProps = {
  isVisible: boolean;
};
const List = stryMutAct_9fa48("868") ? styled.div`` : (stryCov_9fa48("868"), styled.div`
  overflow-y: auto;
  height: 100%;
`);
const Loader = stryMutAct_9fa48("869") ? styled.div<LoaderProps>`` : (stryCov_9fa48("869"), styled.div<LoaderProps>`
  display: ${stryMutAct_9fa48("870") ? () => undefined : (stryCov_9fa48("870"), ({
  isVisible
}) => isVisible ? stryMutAct_9fa48("871") ? "" : (stryCov_9fa48("871"), 'block') : stryMutAct_9fa48("872") ? "" : (stryCov_9fa48("872"), 'none'))};
`);
export default stryMutAct_9fa48("873") ? {} : (stryCov_9fa48("873"), {
  List,
  Loader
});