import { baseRequest } from './base';

const endpoint = '/moove/applications';

export interface WorkspaceFilter {
  name?: string;
}

const initialWorkspaceFilter = {
  name: ''
};

export const findAllWorkspace = (
  filter: WorkspaceFilter = initialWorkspaceFilter
) => {
  const sizeFixed = 200;
  const params = new URLSearchParams({
    size: `${sizeFixed}`,
    name: filter?.name
  });

  return baseRequest(`${endpoint}?${params}`);
};

export const findWorkspaceById = (id: string) =>
  baseRequest(`${endpoint}/${id}`);
