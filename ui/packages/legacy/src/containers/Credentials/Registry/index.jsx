import React, { useState, useEffect } from 'react'
import { Title, Translate, Button } from 'components'
import useStep from 'core/helpers/step'
import { useRouter } from 'core/routing/hooks'
import { StyledConfig } from 'containers/Credentials/styled'
import Resume from 'containers/Resume'
import { SETTINGS_CREDENTIALS } from 'core/constants/routes'
import { getUserProfileData } from 'core/helpers/profile'
import connectionRegistryStream from '../stream/registry'
import { ConfigInput, ConfigToggle } from '../components'
import UsernameRegistryLogin from './UsernameRegistryLogin'
import AwsRegistryLogin from './AwsRegistryLogin'

const RegistryConfig = ({ registryStream }) => {
  const { store$, actions$ } = registryStream
  const { step, stepHandler } = useStep(['name', 'provider', 'address', 'login', 'finish'])
  const [payload, setPayload] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    store$.subscribe(registry => setLoading(registry.loading))
  }, [])

  const handlePayload = (key, value, resumeFn) => {
    if (key === 'provider' && value === 'Azure') {
      const { accessKey, region, secretKey, ...rest } = payload
      setPayload({ ...rest, [key]: value })
    } else {
      setPayload({ ...payload, [key]: value })
    }

    stepHandler.next()
    resumeFn && resumeFn()
  }

  const handleLoginPayload = ({ username, password }, resumeFn) => {
    setPayload({ ...payload, username, password })
    stepHandler.next()
    resumeFn()
  }

  const handleAwsPayload = ({ accessKey, secretKey, region }, resumeFn) => {
    setPayload({ ...payload, accessKey, secretKey, region })
    stepHandler.next()
    resumeFn()
  }

  const onSubmit = () => {
    actions$
      .saveRegistry({
        ...payload,
        authorId: getUserProfileData('id'),
      })
      .subscribe(() => router.push(SETTINGS_CREDENTIALS))
  }

  const mapFields = resumeFn => ({
    AWS: <AwsRegistryLogin resumeFn={resumeFn} handleLoginPayload={handleAwsPayload} />,
    Azure: <UsernameRegistryLogin resumeFn={resumeFn} handleLoginPayload={handleLoginPayload} />,
  })


  return (
    <StyledConfig.ModalContent
      onClose={() => router.push(SETTINGS_CREDENTIALS)}
    >
      <Title primary text="credentials.title.registry" />
      <StyledConfig.Step step={step.name}>
        <ConfigInput
          label="credentials.registry.label.name"
          field="name"
          resumeName="general.name"
          value={payload.name}
          onClick={handlePayload}
        />
      </StyledConfig.Step>
      <StyledConfig.Step step={step.provider}>
        <ConfigToggle
          label="credentials.registry.label.provider"
          field="provider"
          resumeName="credentials.registry.provider"
          selected={payload.provider}
          items={[
            { name: 'AWS' },
            { name: 'Azure' },
          ]}
          onSelect={handlePayload}
        />
      </StyledConfig.Step>
      <>
        <StyledConfig.Step step={step.address}>
          <ConfigInput
            label="credentials.registry.label.address"
            field="address"
            resumeName="general.url"
            value={payload.address}
            onClick={handlePayload}
          />
        </StyledConfig.Step>
        <StyledConfig.Step step={step.login}>
          <Resume name="credentials.auth.method" tags={[payload.username || payload.region]}>
            {resumeFn => mapFields(resumeFn)[payload.provider]}
          </Resume>
        </StyledConfig.Step>
        <StyledConfig.Step step={step.finish}>
          <Button
            type="button"
            margin="0 15px"
            onClick={onSubmit}
            isLoading={loading}
            properties={{ disabled: loading }}
          >
            <Translate id="general.finish" />
          </Button>
        </StyledConfig.Step>
      </>

    </StyledConfig.ModalContent>
  )
}

export default connectionRegistryStream(RegistryConfig)
