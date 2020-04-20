import { UsersActionTypes, ACTION_TYPES } from './actions';
import { UserPagination } from '../interfaces/UserPagination';
import { UserState } from '../interfaces/UserState';

const initialListState: UserPagination = {
  content: [],
  page: 0,
  size: 0,
  totalPages: 0,
  last: false
};

export const userInitialState: UserState = {
  list: initialListState,
  item: null
};

export const userReducer = (
  state = userInitialState,
  action: UsersActionTypes
): UserState => {
  switch (action.type) {
    case ACTION_TYPES.loadedUsers: {
      return {
        ...state,
        list: action.payload
      };
    }
    case ACTION_TYPES.loadedUser: {
      return {
        ...state,
        item: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
