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
const CirclesListContainer = stryMutAct_9fa48("3409") ? styled.div`` : (stryCov_9fa48("3409"), styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 10px;
  flex-direction: column;
`);
const CirclesListWrapper = stryMutAct_9fa48("3410") ? styled.div`` : (stryCov_9fa48("3410"), styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
`);
const CirclesListButton = stryMutAct_9fa48("3411") ? styled.div`` : (stryCov_9fa48("3411"), styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;

  > span {
    margin-left: 10px;
  }
`);
const AvailableContainer = stryMutAct_9fa48("3412") ? styled.div`` : (stryCov_9fa48("3412"), styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  max-height: 500px;

  > div:first-child:last-child {
    border-radius: 4px 4px 4px 4px;
  }

  > div:first-child {
    border-radius: 4px 4px 0 0;
  }

  > div:last-child {
    border-radius: 0 0 4px 4px;
  }
`);
const AvailableItem = stryMutAct_9fa48("3413") ? styled.div`` : (stryCov_9fa48("3413"), styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: inherit;
  padding: 18px;
  height: 32px;
  background-color: ${stryMutAct_9fa48("3414") ? () => undefined : (stryCov_9fa48("3414"), ({
  theme
}) => theme.modal.default.background)};
`);
export default stryMutAct_9fa48("3415") ? {} : (stryCov_9fa48("3415"), {
  AvailableContainer,
  AvailableItem,
  CirclesListContainer,
  CirclesListButton,
  CirclesListWrapper
});