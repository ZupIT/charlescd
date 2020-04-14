import React from 'react'
import CharlesLogo from 'core/assets/svg/charles-logo.svg'
import Form from './Form'
import { useLogin } from './service'
import Styled from './styled'

const Login = () => {
  const [loading, doLogin] = useLogin()

  return (
    <Styled.Wrapper>
      <CharlesLogo />
      <Form
        isLoading={loading}
        onSubmit={({ email, password }) => doLogin(email, password)}
      />
    </Styled.Wrapper>
  )
}

export default Login
