import { CIRCLE_STATUS } from './hooks';
import { Action as MenuAction } from 'core/components/Menu';

export const menuFilterItems: MenuAction[] = [
  {
    label: 'Active',
    name: CIRCLE_STATUS.active
  },
  {
    label: 'Inactive',
    name: CIRCLE_STATUS.inactives
  }
];
