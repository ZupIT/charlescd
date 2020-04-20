import { WorkspacePagination } from './WorkspacePagination';
import { Workspace } from './Workspace';

export interface WorkspaceState {
  list: WorkspacePagination;
  item: Workspace;
}
