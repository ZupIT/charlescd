interface Users {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  createdAt: string;
}

export interface WorkspacePaginationItem {
  id: string;
  name: string;
  users: Users;
}

export interface WorkspacePagination {
  content: WorkspacePaginationItem[];
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
}
