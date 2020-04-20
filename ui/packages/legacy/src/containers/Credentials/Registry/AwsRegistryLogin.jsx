import React from 'react'
import { Translate, Button } from 'components'
import { FinalForm } from 'containers/FinalForm'
import { StyledConfig } from 'containers/Credentials/styled'

const AwsRegistryLogin = (props) => {
  const { handleLoginPayload, resumeFn } = props

  return (
    <FinalForm onSubmit={data => handleLoginPayload(data, resumeFn)}>
      {() => (
        <>
          <StyledConfig.Block margin>
            <StyledConfig.Input
              name="accessKey"
              label="credentials.auth.accessKey"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
          </StyledConfig.Block>
          <StyledConfig.Block margin>
            <StyledConfig.Input
              name="secretKey"
              type="password"
              label="credentials.auth.secretKey"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
          </StyledConfig.Block>
          <StyledConfig.Block margin>
            <StyledConfig.Input
              name="region"
              label="credentials.auth.region"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
          </StyledConfig.Block>
          <Button type="submit">
            <Translate id="general.ok" />
          </Button>
        </>
      )}
    </FinalForm>
  )
}

export default AwsRegistryLogin
