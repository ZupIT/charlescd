import routes from 'core/constants/routes';
import { genMenuId } from './Sidebar/helpers';

export const menuItems = [
  {
    id: genMenuId(routes.circles),
    icon: 'circles',
    text: 'Circles',
    to: routes.circles
  },
  {
    id: genMenuId(routes.hypotheses),
    icon: 'hypotheses',
    text: 'Hypotheses',
    to: routes.hypotheses
  },
  {
    id: genMenuId(routes.modules),
    icon: 'modules',
    text: 'Modules',
    to: routes.modules
  },
  {
    id: genMenuId(routes.settings),
    icon: 'settings',
    text: 'Settings',
    subItems: [
      {
        id: genMenuId(routes.workspace),
        text: 'Workspace',
        to: routes.workspace
      },
      {
        id: genMenuId(routes.groups),
        text: 'Groups',
        to: routes.groups
      },
      {
        id: genMenuId(routes.users),
        text: 'Users',
        to: routes.users
      }
    ]
  }
];

export const settings = [
  {
    id: 'menu-settings',
    icon: 'settings',
    text: 'Settings',
    subItems: [
      {
        id: 'sub-menu-workspace',
        text: 'Workspace',
        to: routes.workspace
      },
      {
        id: 'sub-menu-groups',
        text: 'Groups',
        to: routes.groups
      },
      {
        id: 'sub-menu-users',
        text: 'Users',
        to: routes.users
      }
    ],
    to: routes.workspace
  }
];
