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
import { dark as darkBoard } from './board';
import { dark as darkCircleMatcher } from './circleMatcher';
import { dark as darkCircleSegmentation } from './circleSegmentation';
import { dark as darkCheckbox } from './checkbox';
import { dark as darkCircleGroupMetrics } from './circleGroupMetrics';
import { zIndex } from '../zindex';

const common = {
  zIndex
};

const light = {
  ...common
};

const dark = {
  ...common,
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
  board: darkBoard,
  circleMatcher: darkCircleMatcher,
  circleSegmentation: darkCircleSegmentation,
  checkbox: darkCheckbox,
  circleGroupMetrics: darkCircleGroupMetrics
};

export default {
  dark,
  light
};
