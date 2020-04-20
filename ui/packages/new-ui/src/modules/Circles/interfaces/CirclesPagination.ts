import { Deployment } from './Circle';

export interface CirclePaginationItem {
  id: string;
  name: string;
  createdAt: string;
  deployment: Deployment;
}

export interface CirclePagination {
  content: CirclePaginationItem[];
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}
