import React, { Fragment, useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Title, Translate, Toggle, Button, Label } from 'components'
import Resume from 'containers/Resume'
import { FinalForm } from 'containers/FinalForm'
import useStep from 'core/helpers/step'
import { useRouter } from 'core/routing/hooks'
import { COLORS } from 'core/assets/themes'
import GitHubSVG from 'core/assets/svg/github-light.svg'
import GitLabSVG from 'core/assets/svg/gitlab.svg'
import { SETTINGS_CREDENTIALS } from 'core/constants/routes'
import { getUserProfileData } from 'core/helpers/profile'
import connectionGitStream from '../stream/git'
import { StyledGit } from './styled'
import { StyledConfig } from '../styled'

const GitConfig = (props) => {
  const { gitStream } = props
  const { actions$, store$ } = gitStream
  const { step, stepHandler } = useStep(['git', 'name', 'address', 'connectType', 'finish'])
  const [payload, setPayload] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    store$.subscribe(git => setLoading(git.loading))
  }, [])

  const handlePayload = (key, value, resumeFn) => {
    setPayload({ ...payload, [key]: value })
    stepHandler.next()
    resumeFn && resumeFn()
  }

  const onSubmit = () => {
    const { authType, auth, name, ...rest } = payload
    actions$
      .saveGit({
        name,
        authorId: getUserProfileData('id'),
        credentials: {
          ...rest,
          ...auth[authType],
        },
      })
      .subscribe(() => router.push(SETTINGS_CREDENTIALS))
  }

  const renderAuthLogin = () => (
    <Fragment>
      <StyledGit.Block margin>
        <StyledGit.Input
          name="LOGIN.username"
          label="credentials.auth.username"
          properties={{ autoComplete: 'off' }}
          validate="required"
        />
      </StyledGit.Block>
      <StyledGit.Block margin>
        <StyledGit.Input
          name="LOGIN.password"
          type="password"
          label="credentials.auth.password"
          properties={{ autoComplete: 'off' }}
          validate="required"
        />
      </StyledGit.Block>
    </Fragment>
  )

  const renderAuthToken = () => (
    <StyledGit.Block margin>
      <StyledGit.Input
        name="TOKEN.accessToken"
        label="credentials.git.auth.token.info"
        properties={{ autoComplete: 'off' }}
        validate="required"
      />
    </StyledGit.Block>
  )

  return (
    <StyledConfig.ModalContent
      onClose={() => router.push(SETTINGS_CREDENTIALS)}
    >
      <Title primary text="credentials.title.git" />
      <StyledGit.Step step={step.git}>
        <Resume
          name="Git"
          tags={[payload.serviceProvider]}
          initial={!isEmpty(payload.serviceProvider)}
        >
          {resumeFn => (
            <StyledGit.Block>
              <Translate id="credentials.git.platform" />
              <StyledGit.Flex>
                <Toggle
                  name="GITHUB"
                  color={COLORS.PRIMARY}
                  icon={<GitHubSVG />}
                  onClick={() => handlePayload('serviceProvider', 'GITHUB', resumeFn)}
                  selected={payload.serviceProvider === 'GITHUB'}
                />
                <Toggle
                  name="GITLAB"
                  color={COLORS.PRIMARY}
                  icon={<GitLabSVG />}
                  onClick={() => handlePayload('serviceProvider', 'GITLAB', resumeFn)}
                  selected={payload.serviceProvider === 'GITLAB'}
                />
              </StyledGit.Flex>
            </StyledGit.Block>
          )}
        </Resume>
      </StyledGit.Step>
      <StyledGit.Step step={step.name}>
        <Resume initial={!isEmpty(payload.name)} name="general.name" tags={[payload.name]}>
          {resumeFn => (
            <FinalForm
              initialValues={{ name: payload.name }}
              onSubmit={({ name }) => handlePayload('name', name, resumeFn)}
            >
              {() => (
                <StyledGit.Form>
                  <StyledGit.Input
                    name="name"
                    label="credentials.git.name"
                    properties={{ autoComplete: 'off' }}
                    validate="required"
                  />
                  <Button type="submit" margin="0 15px">
                    <Translate id="general.ok" />
                  </Button>
                </StyledGit.Form>
              )}
            </FinalForm>
          )}
        </Resume>
      </StyledGit.Step>
      <StyledGit.Step step={step.address}>
        <Resume initial={!isEmpty(payload.address)} name="general.url" tags={[payload.address]}>
          {resumeFn => (
            <FinalForm
              initialValues={{ address: payload.address }}
              onSubmit={({ address }) => handlePayload('address', address, resumeFn)}
            >
              {() => (
                <StyledGit.Form>
                  <StyledGit.Input
                    name="address"
                    label="credentials.git.address"
                    properties={{ autoComplete: 'off' }}
                    validate="required"
                  />
                  <Button type="submit" margin="0 15px">
                    <Translate id="general.ok" />
                  </Button>
                </StyledGit.Form>
              )}
            </FinalForm>
          )}
        </Resume>
      </StyledGit.Step>
      <StyledGit.Step step={step.connectType}>
        <Resume initial={!isEmpty(payload.auth)} name="credentials.auth.method" tags={[payload.authType]}>
          {resumeFn => (
            <StyledGit.Block>
              <Label id="credentials.git.auth" />
              <StyledGit.Block margin>
                <StyledGit.Flex>
                  <Toggle
                    name="credentials.git.auth.token"
                    color={COLORS.PRIMARY}
                    icon={<GitHubSVG />}
                    onClick={() => handlePayload('authType', 'TOKEN')}
                    selected={payload.authType === 'TOKEN'}
                  />
                  <Toggle
                    name="credentials.git.auth.login"
                    color={COLORS.PRIMARY}
                    icon={<GitLabSVG />}
                    onClick={() => handlePayload('authType', 'LOGIN')}
                    selected={payload.authType === 'LOGIN'}
                  />
                </StyledGit.Flex>
              </StyledGit.Block>
              <FinalForm onSubmit={data => handlePayload('auth', data, resumeFn)}>
                {() => (
                  <StyledGit.Block>
                    {payload.authType === 'LOGIN' && renderAuthLogin()}
                    {payload.authType === 'TOKEN' && renderAuthToken()}
                    <Button type="submit">
                      <Translate id="general.next" />
                    </Button>
                  </StyledGit.Block>
                )}
              </FinalForm>
            </StyledGit.Block>
          )}
        </Resume>
      </StyledGit.Step>
      <StyledGit.Step step={step.finish}>
        <Button
          type="button"
          margin="0 15px"
          onClick={onSubmit}
          isLoading={loading}
          properties={{ disabled: loading }}
        >
          <Translate id="general.finish" />
        </Button>
      </StyledGit.Step>
    </StyledConfig.ModalContent>
  )
}

export default connectionGitStream(GitConfig)
