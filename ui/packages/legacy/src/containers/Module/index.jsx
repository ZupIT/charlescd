import React, { useEffect, useState } from 'react'
import map from 'lodash/map'
import { useRouter } from 'core/routing/hooks'
import HeaderNav from 'components/HeaderNav'
import { getUserProfileData } from 'core/helpers/profile'
import CardModule from 'containers/Module/CardModule'
import { CardLoader } from 'containers/Module/Loaders'
import { useScroll } from 'core/hooks/scroll'
import { ZERO } from 'core/helpers/constants'
import { InfiniteLoading } from 'components'
import { Col } from 'components/Grid'
import { DASHBOARD_MODULES_CREATE } from 'core/constants/routes'
import connectionModuleStream, { initialState } from './stream/module'
import { StyledModule } from './styled'

const Module = ({ moduleStream, children }) => {
  const router = useRouter()
  const [modules, setModules] = useState(initialState)
  const { list: { content: list } } = modules
  const isFirstLoading = modules.loading && list.length === ZERO
  const isLoadingMore = modules.loading && list.length > ZERO

  useScroll(() => {
    if (!modules.loading && !modules.list.last) {
      moduleStream.store$.subscribe(setModules)
      moduleStream.actions$.getModules()
    }
  })

  useEffect(() => {
    moduleStream.store$.subscribe(setModules)
    moduleStream.actions$.getModules()
  }, [])

  const renderContent = () => (
    <StyledModule.Content>
      {map(modules?.list?.content, module => (
        <Col xs="6" lg="4" key={module.id}>
          <CardModule key={module.id} module={module} />
        </Col>
      ))}
    </StyledModule.Content>
  )

  return (
    <StyledModule.Wrapper>
      <HeaderNav
        user={{ name: getUserProfileData('name') }}
        actionTitle="module.label.select"
        actionLabel="module.action.create"
        onClick={() => router.push(DASHBOARD_MODULES_CREATE)}
      />
      <InfiniteLoading
        isisLoadingMore={isLoadingMore}
      >
        {isFirstLoading ? <CardLoader /> : renderContent()}
      </InfiniteLoading>
      {children}
    </StyledModule.Wrapper>
  )
}

export default connectionModuleStream(Module)
