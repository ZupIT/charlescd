import React from 'react'
import HeaderNav from 'components/HeaderNav'
import { injectIntl } from 'react-intl'
import { useRouter } from 'core/routing/hooks'
import { getUserProfileData } from 'core/helpers/profile'
import { DASHBOARD_CIRCLES_CREATE } from 'core/constants/routes'
import { ContentPage } from 'components'
import Styled from './styled'

const Circle = ({ children }) => {
  const router = useRouter()

  return (
    <ContentPage.Default>
      <HeaderNav
        user={{ name: getUserProfileData('name') }}
        actionTitle="circle.label.selectBelow"
        actionLabel="circle.action.create"
        onClick={() => router.push(DASHBOARD_CIRCLES_CREATE)}
      />
      { children }
    </ContentPage.Default>
  )
}

export default injectIntl(Circle)
