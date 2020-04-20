import React from 'react'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { i18n } from 'core/helpers/translate'
import Translate from 'components/Translate'
import { THEME } from 'components/Button'
import Styled from './styled'

const LoginForm = ({ onSubmit, isLoading, intl }) => {
  const { handleSubmit, register } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Styled.Input
        type="text"
        label={i18n(intl, 'auth.login.username')}
        name="email"
        properties={register({ required: true })}
      />
      <Styled.Input
        type="password"
        label={i18n(intl, 'auth.login.password')}
        name="password"
        autocomplete="current-password"
        properties={register({ required: true })}
      />
      <Styled.Link>
        <Translate id="auth.login.forgotPassword" />
      </Styled.Link>
      <Styled.CustomButton
        isLoading={isLoading}
        type="submit"
        theme={THEME.OUTLINE}
      >
        <Translate id="auth.login.submit" />
      </Styled.CustomButton>
    </form>
  )
}

export default injectIntl(LoginForm)
