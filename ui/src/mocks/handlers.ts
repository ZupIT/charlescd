import auth from './handlers/auth';
import users from './handlers/users';
import circleMatcher from './handlers/circleMatcher';
import workspaces from './handlers/workspaces';

export const handlers = [
  ...auth,
  ...users,
  ...circleMatcher,
  ...workspaces
]
