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
type Status = {
  status: string;
};
const StatusMessageWrapper = stryMutAct_9fa48("895") ? styled.div<Status>`` : (stryCov_9fa48("895"), styled.div<Status>`
  margin-bottom: 20px;
  display: flex;

  span {
    margin-left: 10px;
    color: ${stryMutAct_9fa48("896") ? () => undefined : (stryCov_9fa48("896"), ({
  theme,
  status
}) => theme.metrics.provider[status])};
  }

  svg {
    color: ${stryMutAct_9fa48("897") ? () => undefined : (stryCov_9fa48("897"), ({
  theme,
  status
}) => theme.metrics.provider[status])};
  }
`);
export default stryMutAct_9fa48("898") ? {} : (stryCov_9fa48("898"), {
  StatusMessageWrapper
});