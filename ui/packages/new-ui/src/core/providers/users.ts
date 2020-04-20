import { baseRequest } from './base';

const endpoint = '/moove/users';

export interface UserFilter {
  name?: string;
}

const initialUserFilter = {
  name: ''
};

export const findAllUsers = (filter: UserFilter = initialUserFilter) => {
  const defaultPage = 0;
  const defaultSize = 25;
  const params = new URLSearchParams({
    size: `${defaultSize}`,
    page: `${defaultPage}`,
    name: filter?.name
  });

  return baseRequest(`${endpoint}?${params}`);
};

export const findUserById = (id: string) => baseRequest(`${endpoint}/${id}`);

export const findUserByEmail = (email: string) => {
  const encodeEmail = btoa(email);

  return baseRequest(`${endpoint}/${encodeEmail}`);
};
