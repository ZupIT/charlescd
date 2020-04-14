import React, { Fragment, useEffect, useState } from 'react'
import map from 'lodash/map'
import { Translate } from 'components'
import UserPanel from 'containers/UserPanel'
import { StyledConfig } from 'containers/Credentials/styled'
import { COLORS } from 'core/assets/themes'
import { useRouter } from 'core/routing/hooks'
import GitSVG from 'core/assets/svg/git-xl.svg'
import RegistrySVG from 'core/assets/svg/registry.svg'
import K8sSVG from 'core/assets/svg/k8s.svg'
import {
  SETTINGS_CREDENTIALS_GIT,
  SETTINGS_CREDENTIALS_K8S,
  SETTINGS_CREDENTIALS_REGISTRY,
} from 'core/constants/routes'
import { ListConfigLoader } from '../Loaders'
import connectionConfigStream from '../stream/config'
import Styled from './styled'


const Credentials = ({ configStream, children }) => {
  const { store$, actions$ } = configStream
  const [configs, setConfigs] = useState(store$.getValue())
  const router = useRouter()

  useEffect(() => {
    actions$.getConfigs()
    store$.subscribe(setConfigs)
  }, [])

  const configType = {
    git: {
      icon: <GitSVG />,
      text: 'Git',
      button: {
        text: 'credentials.title.git',
        link: SETTINGS_CREDENTIALS_GIT,
      },
    },
    cd: {
      icon: <K8sSVG />,
      text: 'Kubernetes',
      button: {
        text: 'credentials.title.k8s',
        link: SETTINGS_CREDENTIALS_K8S,
      },
    },
    registry: {
      icon: <RegistrySVG />,
      text: 'Registry',
      button: {
        text: 'credentials.title.registry',
        link: SETTINGS_CREDENTIALS_REGISTRY,
      },
    },
  }

  const renderConfig = (type) => {
    const config = configType[type]

    return (
      <Fragment>
        <StyledConfig.Config.Title text={config.text} />
        <StyledConfig.Cards>
          { map(configs[type], item => (
            <StyledConfig.Card.Box key={item.id} shadowed>
              <StyledConfig.Block center>
                { config.icon }
                <StyledConfig.Card.Text>
                  { item.name }
                </StyledConfig.Card.Text>
              </StyledConfig.Block>
            </StyledConfig.Card.Box>
          ))}
          <StyledConfig.Card.Box
            button
            shadowed
            onClick={() => router.push(config.button.link)}
          >
            <StyledConfig.Block center>
              <StyledConfig.Config.Button>
                <StyledConfig.Plus />
              </StyledConfig.Config.Button>
              <StyledConfig.Card.Text color={COLORS.PRIMARY}>
                <Translate id={config.button.text} />
              </StyledConfig.Card.Text>
            </StyledConfig.Block>
          </StyledConfig.Card.Box>
        </StyledConfig.Cards>
      </Fragment>
    )
  }

  const renderConfigs = () => (
    <Fragment>
      { renderConfig('git') }
      { renderConfig('registry') }
      { renderConfig('cd') }
    </Fragment>
  )

  return (
    <React.Fragment>
      <UserPanel inverted />
      <Styled.Wrapper>
        { configs.loading ? <ListConfigLoader /> : renderConfigs() }
      </Styled.Wrapper>
      {children}
    </React.Fragment>
  )
}

export default connectionConfigStream(Credentials)
