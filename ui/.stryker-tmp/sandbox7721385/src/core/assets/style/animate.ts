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

import { keyframes } from 'styled-components';
export const slideInLeft = stryMutAct_9fa48("41") ? keyframes`` : (stryCov_9fa48("41"), keyframes`
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`);
export const jiggle = stryMutAct_9fa48("42") ? keyframes`` : (stryCov_9fa48("42"), keyframes`
  0% {
    transform: rotate(-1deg);
	}

	50% {
   	transform: rotate(1deg);
	}
`);
export const jiggleRevert = stryMutAct_9fa48("43") ? keyframes`` : (stryCov_9fa48("43"), keyframes`
  0% {
    transform: rotate(1deg);
    animation-timing-function: ease-in;
  }

  50% {
    transform: rotate(-1.5deg);
    animation-timing-function: ease-out;
  }
`);
export const slideInRight = stryMutAct_9fa48("44") ? keyframes`` : (stryCov_9fa48("44"), keyframes`
  from {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`);
export const fadeIn = stryMutAct_9fa48("45") ? keyframes`` : (stryCov_9fa48("45"), keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 0.9;
  }
`);
export const slideDown = stryMutAct_9fa48("46") ? keyframes`` : (stryCov_9fa48("46"), keyframes`
  0% {
    transform: translate(0, -500px);
  }

  100% {
    transform: translate(0, 0);
  }
`);
export const scaleIn = stryMutAct_9fa48("47") ? keyframes`` : (stryCov_9fa48("47"), keyframes`
  0% {
    opacity: 0;
    transform: scale(.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`);
export const pulse = stryMutAct_9fa48("48") ? keyframes`` : (stryCov_9fa48("48"), keyframes`
	0% {
		transform: scale(1);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: scale(1.2);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(1);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
`);
export const upDown = stryMutAct_9fa48("49") ? keyframes`` : (stryCov_9fa48("49"), keyframes`
  0% {
    transform: translateX(0);
    transform: translateY(0);
  }

  50% {
    transform: translateX(-100px);
    transform: translateY(-150px);
  }

  100% {
    transform: translateX(-800px);
    transform: translateY(-50px);
  }
`);