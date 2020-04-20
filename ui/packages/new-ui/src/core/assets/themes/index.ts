import { dark as darkText } from './text';
import { dark as darkMenuPage } from './menuPage';
import { dark as darkInput } from './input';
import { dark as darkSidebar } from './sidebar';
import { dark as darkScroll } from './scroll';
import { dark as darkMain } from './main';
import { dark as darkFooter } from './footer';
import { dark as darkCard } from './card';
import { dark as darkButton } from './button';
import { dark as darkBadge } from './badge';
import { dark as darkIcon } from './icon';
import { dark as darkLabeledIcon } from './labeledIcon';
import { dark as darkPanel } from './panel';
import { dark as darkMenu } from './menu';
import { dark as darkDropdown } from './dropdown';
import { dark as darkTabPanel } from './tabPanel';
import { dark as darkSelect } from './select';
import { dark as darkMetrics } from './metrics';
import { zIndex } from '../zindex';

const common = {
  zIndex
};

const light = {
  ...common
};

const dark = {
  ...common,
  text: darkText,
  icon: darkIcon,
  menuPage: darkMenuPage,
  input: darkInput,
  sidebar: darkSidebar,
  scroll: darkScroll,
  main: darkMain,
  footer: darkFooter,
  card: darkCard,
  button: darkButton,
  badge: darkBadge,
  labeledIcon: darkLabeledIcon,
  menu: darkMenu,
  dropdown: darkDropdown,
  tabPanel: darkTabPanel,
  select: darkSelect,
  panel: darkPanel,
  metrics: darkMetrics
};

export default {
  dark,
  light
};
