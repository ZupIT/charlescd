import React from 'react'
import map from 'lodash/map'
import { CardCircle, CardRelease } from 'core/components'
import InfoSVG from 'core/assets/svg/info.svg'
import { DASHBOARD_CIRCLES } from 'core/constants/routes'
import { useRouter } from 'core/routing/hooks'
import ColumnHeader from './ColumnHeader'
import ColumnContent from './ContentColumn'
import Styled from './styled'

const DeployedReleasesColumn = ({ id, name, list }) => {
  const history = useRouter()

  const renderDeployment = deployment => (
    <CardCircle
      key={deployment?.id}
      name={deployment?.circle?.name}
      deployedAt={deployment?.deployedAt}
      onClick={() => {
        window.location.href = `${DASHBOARD_CIRCLES}/compare?circle=${deployment?.circle?.id}`
      }}
      body={(
        <CardRelease
          icon={<InfoSVG />}
          status={deployment?.status}
          body={deployment?.tag}
        />
      )}
    />
  )

  const renderDeployments = release => map(
    release.deployments, deployment => renderDeployment(deployment),
  )

  const renderReleases = () => map(list, release => renderDeployments(release))

  return (
    <Styled.Wrapper>
      <ColumnHeader id={name} />
      <ColumnContent
        id={id}
        type={name}
      >
        { renderReleases() }
      </ColumnContent>
    </Styled.Wrapper>
  )
}

export default DeployedReleasesColumn
