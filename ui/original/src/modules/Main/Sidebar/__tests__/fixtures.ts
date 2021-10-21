export const workspaceMenu = [
  {
    id: 'menu-circles',
    icon: 'circles',
    text: 'Circles',
    to: '/circles',
    action: 'read',
    subject: 'circles'
  },
  {
    id: 'menu-hypotheses',
    icon: 'hypotheses',
    text: 'Hypotheses',
    to: '/hypotheses',
    action: 'read',
    subject: 'hypothesis'
  },
  {
    id: 'menu-modules',
    icon: 'modules',
    text: 'Modules',
    to: '/modules',
    action: 'read',
    subject: 'modules'
  },
  {
    id: 'menu-metrics',
    icon: 'metrics',
    text: 'Metrics',
    to: '/metrics',
    action: 'read',
    subject: 'circles'
  },
  {
    id: 'menu-settings',
    icon: 'settings',
    text: 'Settings',
    to: '/settings/credentials',
    action: 'write',
    subject: 'maintenance'
  }
];

export const mainMenu = [
  {
    id: 'menu-workspaces',
    icon: 'workspaces',
    text: 'Workspaces',
    to: '/workspaces'
  },
  {
    id: 'menu-account',
    icon: 'account',
    text: 'Account',
    to: '/account'
  }
];

export const rootMainMenu = [
  {
    id: 'menu-workspaces',
    icon: 'workspace',
    text: 'Workspaces',
    to: '/workspaces'
  },
  {
    id: 'menu-users',
    icon: 'user',
    text: 'Users',
    to: '/users'
  },
  {
    id: 'menu-groups',
    icon: 'users',
    text: 'User Group',
    to: '/groups'
  },
  {
    id: 'menu-account',
    icon: 'account',
    text: 'Account',
    to: '/account'
  }
];
