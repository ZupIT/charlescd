import React from 'react'
import ContentLoader from 'react-content-loader'
import Styled from 'containers/Workspaces/styled'

const WorkspaceModalLoader = () => (

  <div style={{ width: '400px', height: '300px' }}>
    <Styled.Content icon={<Styled.SideIcon />}>
      <ContentLoader
        width={400}
        height={30}
        speed={2}
        primaryColor="#1C1C1E"
        secondaryColor="#2C2C2E"
      >
        <rect x="0" y="0" rx="10" ry="1" width="374" height="20" />
      </ContentLoader>
    </Styled.Content>
    <Styled.Content icon={<Styled.MemberIcon />}>
      <ContentLoader
        width={400}
        height={30}
        speed={2}
        primaryColor="#1C1C1E"
        secondaryColor="#2C2C2E"
      >
        <rect x="0" y="0" rx="10" ry="1" width="374" height="20" />
      </ContentLoader>
    </Styled.Content>
  </div>
)

export default WorkspaceModalLoader
