import { UserGroup } from 'modules/Groups/interfaces/UserGroups';
import map from 'lodash/map';

export const implementCounter = (userGroup: UserGroup) => {
  let count = 0;
  map(userGroup?.users, (user, index) => {
    if (index > 7) {
      count = count + 1;
    }
  });
  return count;
};