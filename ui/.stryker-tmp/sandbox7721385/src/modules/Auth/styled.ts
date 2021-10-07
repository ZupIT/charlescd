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
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import ButtonComponentDefault from 'core/components/Button/ButtonDefault';
import { upDown } from 'core/assets/style/animate';
const Wrapper = stryMutAct_9fa48("2682") ? styled.div`` : (stryCov_9fa48("2682"), styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: ${stryMutAct_9fa48("2683") ? () => undefined : (stryCov_9fa48("2683"), ({
  theme
}) => theme.main.background)};
  overflow: hidden;
`);
const Container = stryMutAct_9fa48("2684") ? styled.div`` : (stryCov_9fa48("2684"), styled.div`
  position: relative;
  width: 1080px;
  height: 100vh;
  margin: 0 auto;
`);
const Background = stryMutAct_9fa48("2685") ? styled.div`` : (stryCov_9fa48("2685"), styled.div`
  position: absolute;
  left: 580px;
  top: -700px;

  svg {
    path:nth-child(1) {
      animation: ${upDown} 18s infinite alternate;
    }

    path:nth-child(2) {
      animation: ${upDown} 12s infinite alternate;
    }

    path:nth-child(3) {
      animation: ${upDown} 17s infinite alternate;
    }

    path:nth-child(4) {
      animation: ${upDown} 14s infinite alternate;
    }

    path:nth-child(5) {
      animation: ${upDown} 15s infinite alternate;
    }

    path:nth-child(6) {
      animation: ${upDown} 11s infinite alternate;
    }

    path:nth-child(7) {
      animation: ${upDown} 13s infinite alternate;
    }

    path:nth-child(8) {
      animation: ${upDown} 10s infinite alternate;
    }

    path:nth-child(9) {
      animation: ${upDown} 16s infinite alternate;
    }

    path:nth-child(10) {
      animation: ${upDown} 15s infinite alternate;
    }

    path:nth-child(11) {
      animation: ${upDown} 16s infinite alternate;
    }
  }
`);
const Copyright = stryMutAct_9fa48("2686") ? styled(Text)`` : (stryCov_9fa48("2686"), styled(Text)`
  position: absolute;
  display: flex;
  align-items: center;
  left: 141px;
  bottom: 25px;
`);
const Heart = stryMutAct_9fa48("2687") ? styled(Icon)`` : (stryCov_9fa48("2687"), styled(Icon)`
  margin: 0 5px;
`);
const Zup = stryMutAct_9fa48("2688") ? styled(Icon)`` : (stryCov_9fa48("2688"), styled(Icon)`
  margin: 0 5px;
`);
const Content = stryMutAct_9fa48("2689") ? styled.div`` : (stryCov_9fa48("2689"), styled.div`
  position: absolute;
  margin-top: 251px;
  margin-left: 141px;
`);
const Title = stryMutAct_9fa48("2690") ? styled(Text)`` : (stryCov_9fa48("2690"), styled(Text)`
  margin: 39px 0 30px;
`);
const Form = stryMutAct_9fa48("2691") ? styled.form`` : (stryCov_9fa48("2691"), styled.form`
  position: relative;
  width: 252px;
`);
const Field = stryMutAct_9fa48("2692") ? styled.div`` : (stryCov_9fa48("2692"), styled.div`
  margin-top: 28px;
`);
const Error = stryMutAct_9fa48("2693") ? styled(Text)`` : (stryCov_9fa48("2693"), styled(Text)`
  margin-top: 5px;
`);
const Button = stryMutAct_9fa48("2694") ? styled(ButtonComponentDefault)`` : (stryCov_9fa48("2694"), styled(ButtonComponentDefault)`
  position: absolute;
  border-radius: 30px;
  margin-top: 28px;
  right: 0;
`);
export default stryMutAct_9fa48("2695") ? {} : (stryCov_9fa48("2695"), {
  Wrapper,
  Background,
  Container,
  Content,
  Title,
  Form,
  Field,
  Error,
  Button,
  Copyright,
  Heart,
  Zup
});