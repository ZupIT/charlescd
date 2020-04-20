import React from 'react'
import { useRouter } from 'core/routing/hooks'
import UserPanel from 'containers/UserPanel'
import { Translate } from 'components'
import Nav from 'components/Nav'
import ErrorRocketPNG from 'core/assets/img/error-rocket.png'
import { DASHBOARD_CIRCLES, DASHBOARD_HYPOTHESES, DASHBOARD_MODULES } from 'core/constants/routes'
import Styled from './styled'

const Error = () => {
  const router = useRouter()
  const navItems = [
    { label: 'general.circles', path: DASHBOARD_CIRCLES },
    { label: 'general.hypotheses', path: DASHBOARD_HYPOTHESES },
    { label: 'general.modules', path: DASHBOARD_MODULES },
  ]

  return (
    <>
      <UserPanel />
      <Styled.Wrapper>
        <Styled.Row>
          <Nav items={navItems} />
        </Styled.Row>
        <Styled.Row>
          <Styled.Content>
            <Styled.Title>
              <Translate id="general.error" />
            </Styled.Title>
            <Styled.Button
              onClick={() => router.push(DASHBOARD_CIRCLES)}
            >
              <Translate id="general.go.home" />
            </Styled.Button>
          </Styled.Content>

          <img src={ErrorRocketPNG} alt="Rocket Error" />
        </Styled.Row>
      </Styled.Wrapper>
    </>
  )
}

export default Error
