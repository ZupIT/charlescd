import React, { useEffect } from 'react'
import map from 'lodash/map'
import { getPath } from 'core/helpers/routes'
import { useRouter } from 'core/routing/hooks'
import Plus from 'core/assets/svg/plus.svg'
import {
  SETTINGS_PERMISSIONS_WORKSPACE_CREATE,
  SETTINGS_PERMISSIONS_WORKSPACE_EDIT,
} from 'core/constants/routes'
import { useSelector } from 'core/state/hooks'
import ApplicationItem from 'containers/Workspaces/ApplicationItem'
import { IconButton } from 'components/IconButton'
import Translate from 'components/Translate'
import Styled from './styled'
import WorkspaceListLoader from './Loaders/WorkspaceListLoader'
import { useWorkspace } from './hooks/workspaces'

const Workspaces = ({ children }) => {
  const history = useRouter()
  const [{ loadingWorkspaces }, { getWorkspaces }] = useWorkspace()
  const { list } = useSelector(({ workspaces }) => workspaces)

  useEffect(() => {
    getWorkspaces()
  }, [])

  const renderApplications = () => (
    map(list, ({ id, name, membersCount }, index) => (
      <ApplicationItem
        key={`${index}-${id}`}
        name={name}
        membersCount={membersCount}
        onAppClick={() => history.push(getPath(SETTINGS_PERMISSIONS_WORKSPACE_EDIT, [id]))}
      />
    ))
  )

  return (
    <Styled.Wrapper>
      <IconButton
        icon={<Plus />}
        onClick={() => history.push(SETTINGS_PERMISSIONS_WORKSPACE_CREATE)}
      >
        <Translate id="permissions.workspace.button.create" />
      </IconButton>
      { !loadingWorkspaces ? renderApplications() : <WorkspaceListLoader /> }
      { children }
    </Styled.Wrapper>
  )
}

export default React.memo(Workspaces)
