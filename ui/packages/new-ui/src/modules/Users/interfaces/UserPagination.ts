export interface Applications {
  id: string;
  name: string;
  menbersCount: number;
}

export interface UserPaginationItem {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  applications: Applications[];
  createdAt: string;
}

export interface UserPagination {
  content: UserPaginationItem[];
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}
