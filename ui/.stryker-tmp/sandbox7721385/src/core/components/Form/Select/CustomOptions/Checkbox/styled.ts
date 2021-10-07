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
type Props = {
  checked?: boolean;
};
const CheckboxContainer = stryMutAct_9fa48("677") ? styled.div`` : (stryCov_9fa48("677"), styled.div`
  display: inline-block;
  vertical-align: middle;
`);
const Icon = stryMutAct_9fa48("678") ? styled.svg`` : (stryCov_9fa48("678"), styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`);
const HiddenCheckbox = stryMutAct_9fa48("681") ? styled.input.attrs(stryMutAct_9fa48("679") ? {} : (stryCov_9fa48("679"), {
  type: stryMutAct_9fa48("680") ? "" : (stryCov_9fa48("680"), 'checkbox')
}))<Props>`` : (stryCov_9fa48("681"), styled.input.attrs(stryMutAct_9fa48("679") ? {} : (stryCov_9fa48("679"), {
  type: stryMutAct_9fa48("680") ? "" : (stryCov_9fa48("680"), 'checkbox')
}))<Props>`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`);
const Checkbox = stryMutAct_9fa48("682") ? styled.div<Props>`` : (stryCov_9fa48("682"), styled.div<Props>`
  display: inline-block;
  width: ${stryMutAct_9fa48("683") ? () => undefined : (stryCov_9fa48("683"), props => props.checked ? stryMutAct_9fa48("684") ? "" : (stryCov_9fa48("684"), '12px') : stryMutAct_9fa48("685") ? "" : (stryCov_9fa48("685"), '10px'))};
  height: ${stryMutAct_9fa48("686") ? () => undefined : (stryCov_9fa48("686"), props => props.checked ? stryMutAct_9fa48("687") ? "" : (stryCov_9fa48("687"), '12px') : stryMutAct_9fa48("688") ? "" : (stryCov_9fa48("688"), '10px'))};
  background: ${stryMutAct_9fa48("689") ? () => undefined : (stryCov_9fa48("689"), ({
  theme,
  checked
}) => checked ? theme.select.checkbox.checked.background : theme.select.checkbox.unchecked.background)};
  border: ${stryMutAct_9fa48("690") ? () => undefined : (stryCov_9fa48("690"), ({
  theme,
  checked
}) => checked ? stryMutAct_9fa48("691") ? "" : (stryCov_9fa48("691"), 'none') : stryMutAct_9fa48("692") ? `` : (stryCov_9fa48("692"), `1px solid ${theme.select.checkbox.unchecked.borderColor}`))};
  border-radius: 2px;

  ${Icon} {
    visibility: ${stryMutAct_9fa48("693") ? () => undefined : (stryCov_9fa48("693"), props => props.checked ? stryMutAct_9fa48("694") ? "" : (stryCov_9fa48("694"), 'visible') : stryMutAct_9fa48("695") ? "" : (stryCov_9fa48("695"), 'hidden'))};
  }
`);
export default stryMutAct_9fa48("696") ? {} : (stryCov_9fa48("696"), {
  CheckboxContainer,
  Icon,
  HiddenCheckbox,
  Checkbox
});