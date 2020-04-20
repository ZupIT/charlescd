import { UserPagination } from '../interfaces/UserPagination';
import { User } from '../interfaces/User';

export enum ACTION_TYPES {
  loadedUsers = 'USERS/LOADED_USERS',
  loadedUser = 'USERS/LOADED_USER'
}

interface LoadedUsersActionType {
  type: typeof ACTION_TYPES.loadedUsers;
  payload: UserPagination;
}

interface LoadedUserActionType {
  type: typeof ACTION_TYPES.loadedUser;
  payload: User;
}

export const LoadedUsersAction = (
  payload: UserPagination
): UsersActionTypes => ({
  type: ACTION_TYPES.loadedUsers,
  payload
});

export const LoadedUserAction = (payload: User): UsersActionTypes => ({
  type: ACTION_TYPES.loadedUser,
  payload
});

export type UsersActionTypes = LoadedUsersActionType | LoadedUserActionType;
