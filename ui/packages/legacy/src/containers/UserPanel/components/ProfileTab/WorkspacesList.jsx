import React, { useState } from 'react'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { useRouter } from 'core/routing/hooks'
import { INDEX_ROUTE } from 'core/constants/routes'
import { getApplication, getApplications, saveApplication } from 'core/helpers/application'
import { StyledProfileDetails, StyledWorkspaces } from 'containers/UserPanel/components/styled'

const WorkspacesList = () => {
  const history = useRouter()
  const [appId, setAppId] = useState(getApplication())
  const applications = getApplications()
  const hasApplications = !isEmpty(applications)

  const onClickWorkspace = (app) => {
    setAppId(app.id)
    saveApplication(app)
    history.push(INDEX_ROUTE)
  }

  return hasApplications && (
    <>
      <StyledProfileDetails.HorizontalDivider inverted />
      <StyledWorkspaces.Wrapper>
        {map(getApplications(), app => (
          <StyledWorkspaces.Item
            key={app.id}
            active={app.id === appId}
            onClick={() => onClickWorkspace(app)}
          >
            <StyledWorkspaces.CheckIcon /> { app.name }
          </StyledWorkspaces.Item>
        ))}
      </StyledWorkspaces.Wrapper>
    </>
  )
}

export default React.memo(WorkspacesList)
