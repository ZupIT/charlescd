import { baseRequest } from './base';

const endpoint = '/moove/circles';

export interface CircleFilter {
  id?: string;
  name?: string;
  active?: boolean;
}

const initialCircleFilter = {
  name: '',
  active: true
};

export const findAllCircles = (filter: CircleFilter = initialCircleFilter) => {
  const sizeFixed = 200;
  const params = new URLSearchParams({
    active: `${filter?.active}`,
    size: `${sizeFixed}`,
    name: filter?.name
  });

  return baseRequest(`${endpoint}?${params}`);
};

export const findCircleById = (filter: CircleFilter) =>
  baseRequest(`${endpoint}/${filter?.id}`);
