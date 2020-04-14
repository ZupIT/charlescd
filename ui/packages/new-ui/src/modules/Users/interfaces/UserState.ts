import { UserPagination } from './UserPagination';
import { User } from './User';

export interface UserState {
  list: UserPagination;
  item: User;
}
