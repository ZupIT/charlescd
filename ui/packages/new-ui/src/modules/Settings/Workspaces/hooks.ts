import { useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { findAllWorkspace } from 'core/providers/workspace';
import { useDispatch } from 'core/state/hooks';
import { loadedWorkspacesAction } from './state/actions';
import { WorkspacePagination } from './interfaces/WorkspacePagination';

export const useWorkspace = (): [Function, Function] => {
  const dispatch = useDispatch();
  const [workspacesData, getWorkspace] = useFetch<WorkspacePagination>(
    findAllWorkspace
  );
  const { response, error } = workspacesData;

  const filerWorkspace = useCallback(
    (name: string) => {
      getWorkspace({ name });
    },
    [getWorkspace]
  );

  useEffect(() => {
    if (!error) {
      dispatch(loadedWorkspacesAction(response));
    } else {
      console.error(error);
    }
  }, [dispatch, response, error]);

  return [filerWorkspace, getWorkspace];
};

export default useWorkspace;
