import { useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { findAllUsers } from 'core/providers/users';
import { useDispatch } from 'core/state/hooks';
import { LoadedUsersAction } from './state/actions';
import { UserPagination } from './interfaces/UserPagination';

export const useUser = (): [Function, Function] => {
  const dispatch = useDispatch();
  const [usersData, getUser] = useFetch<UserPagination>(findAllUsers);
  const { response, error } = usersData;

  const filerUser = useCallback(
    (name: string) => {
      getUser({ name });
    },
    [getUser]
  );

  useEffect(() => {
    if (!error) {
      dispatch(LoadedUsersAction(response));
    } else {
      console.error(error);
    }
  }, [dispatch, response, error]);

  return [filerUser, getUser];
};

export default useUser;
