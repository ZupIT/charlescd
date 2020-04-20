import React from 'react'
import { Translate, Button } from 'components'
import { FinalForm } from 'containers/FinalForm'
import { StyledConfig } from 'containers/Credentials/styled'

const UsernameRegistryLogin = (props) => {
  const { handleLoginPayload, resumeFn } = props

  return (
    <FinalForm onSubmit={data => handleLoginPayload(data, resumeFn)}>
      {() => (
        <>
          <StyledConfig.Block margin>
            <StyledConfig.Input
              name="username"
              label="credentials.auth.username"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
          </StyledConfig.Block>
          <StyledConfig.Block margin>
            <StyledConfig.Input
              name="password"
              type="password"
              label="credentials.auth.password"
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

export default UsernameRegistryLogin
