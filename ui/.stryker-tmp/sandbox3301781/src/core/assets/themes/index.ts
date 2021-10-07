// @ts-nocheck
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

import { dark as darkAvatar } from './avatar';
import { dark as darkText } from './text';
import { dark as darkMenuPage } from './menuPage';
import { dark as darkInput } from './input';
import { dark as darkSidebar } from './sidebar';
import { dark as darkScroll } from './scroll';
import { dark as darkMain } from './main';
import { dark as darkFooter } from './footer';
import { dark as darkRadio } from './radio';
import { dark as darkCard } from './card';
import { dark as darkButton } from './button';
import { dark as darkBadge } from './badge';
import { dark as darkIcon } from './icon';
import { dark as darkLabeledIcon } from './labeledIcon';
import { dark as darkProfile } from './profile';
import { dark as darkPanel } from './panel';
import { dark as darkMenu } from './menu';
import { dark as darkDropdown } from './dropdown';
import { dark as darkPopover } from './popover';
import { dark as darkTabPanel } from './tabPanel';
import { dark as darkSelect } from './select';
import { dark as darkNotification } from './notification';
import { dark as darkMetrics } from './metrics';
import { dark as darkSegments } from './segments';
import { dark as darkModal } from './modal';
import { dark as darkMoove } from './moove';
import { dark as darkSwitch } from './switch';
import { dark as darkCircleMatcher } from './circleMatcher';
import { dark as darkCircleSegmentation } from './circleSegmentation';
import { dark as darkCircleDeploymentHistory } from './circleDeploymentHistory';
import { dark as darkCheckbox } from './checkbox';
import { dark as darkCircleGroupMetrics } from './circleGroupMetrics';
import { dark as darkNavTabs } from './navTabs';
import { dark as darkSummary } from './summary';
import { dark as darkLog } from './log';
import { dark as darkSlider } from './slider';
import { zIndex } from '../zindex';
import { dark as darkToken } from './token';
import { dark as darkEditor } from './editor';
const common = stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
  zIndex
});
const light = stryMutAct_9fa48("97") ? {} : (stryCov_9fa48("97"), { ...common
});
const dark = stryMutAct_9fa48("98") ? {} : (stryCov_9fa48("98"), { ...common,
  avatar: darkAvatar,
  text: darkText,
  icon: darkIcon,
  menuPage: darkMenuPage,
  input: darkInput,
  sidebar: darkSidebar,
  scroll: darkScroll,
  main: darkMain,
  radio: darkRadio,
  footer: darkFooter,
  card: darkCard,
  button: darkButton,
  badge: darkBadge,
  labeledIcon: darkLabeledIcon,
  menu: darkMenu,
  dropdown: darkDropdown,
  popover: darkPopover,
  profile: darkProfile,
  tabPanel: darkTabPanel,
  select: darkSelect,
  notification: darkNotification,
  panel: darkPanel,
  metrics: darkMetrics,
  segments: darkSegments,
  modal: darkModal,
  moove: darkMoove,
  switch: darkSwitch,
  circleMatcher: darkCircleMatcher,
  circleSegmentation: darkCircleSegmentation,
  checkbox: darkCheckbox,
  circleGroupMetrics: darkCircleGroupMetrics,
  circleDeploymentHistory: darkCircleDeploymentHistory,
  navTabs: darkNavTabs,
  summary: darkSummary,
  log: darkLog,
  slider: darkSlider,
  token: darkToken,
  editor: darkEditor
});
export type ThemeScheme = typeof dark;
export default stryMutAct_9fa48("99") ? {} : (stryCov_9fa48("99"), {
  dark,
  light
});